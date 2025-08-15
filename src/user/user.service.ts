import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { PinoLogger } from 'nestjs-pino';
import * as bcrypt from 'bcrypt';
import { randomUUID } from 'crypto';

import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Users } from './entities/user.entity';
import { UserResponseDto } from './dto-responses/user-response.dto';
import { UserListQueryDto } from './dto/user-list-query.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(Users)
    private readonly userRepository: Repository<Users>,
    private readonly logger: PinoLogger,
  ) {
    this.logger.setContext(UserService.name);
  }

  /** Genera un traceId único para correlación */
  private newTraceId(): string {
    return randomUUID();
  }

  private toResponseDto(user: Users): UserResponseDto {
    // Ajusta este mapping a tu UserResponseDto real
    const { id, name, email, birthDate, role } = user;
    return {
      id,
      name,
      email,
      birthDate,
      rol: role ? String(role).toLowerCase() : 'user',
    };
  }

  private applyFilters(
    qb: SelectQueryBuilder<Users>,
    query: UserListQueryDto,
  ): void {
    const {
      name,
      email,
      role,
      status, // <== ahora sí existe en entity
      birthDateFrom,
      birthDateTo,
      // removidos: isActive, documentTypeId (no existen)
    } = query as any;

    if (name) qb.andWhere('u.name ILIKE :name', { name: `%${name}%` });
    if (email) qb.andWhere('u.email ILIKE :email', { email: `%${email}%` });
    if (role) qb.andWhere('u.role = :role', { role });
    if (typeof status === 'boolean')
      qb.andWhere('u.status = :status', { status });
    if (birthDateFrom)
      qb.andWhere('u."birthDate" >= :birthDateFrom', { birthDateFrom });
    if (birthDateTo)
      qb.andWhere('u."birthDate" <= :birthDateTo', { birthDateTo });
  }

  async create(createUserDto: CreateUserDto): Promise<UserResponseDto> {
    const traceId = this.newTraceId();

    // En tu DTO probablemente vengan: name, lastName, email, phone, address, role, birthDate, password, status?
    const { password, ...safeDto } = createUserDto as any;

    this.logger.info({ traceId, email: safeDto?.email }, 'Create user: attempt');

    try {
      let hashedPassword: string | undefined;
      if (password) {
        const rounds = Number(process.env.BCRYPT_SALT_ROUNDS ?? 10);
        this.logger.debug({ traceId, rounds }, 'Hashing password');
        hashedPassword = await bcrypt.hash(password, rounds);
      }

      // id es PK tipo text (no autogenerado). Si no viene en DTO, generamos uno.
      const id = safeDto?.id ?? randomUUID();

      const user = this.userRepository.create({
        id,
        ...safeDto,
      } as Partial<Users>);

      if (hashedPassword) {
        user.passwordHash = hashedPassword; // columna es password_hash en DB (mapeada en entity)
      }

      await this.userRepository.save(user);

      this.logger.info({ traceId, userId: user.id, email: user.email }, 'Create user: success');
      return this.toResponseDto(user);
    } catch (err: any) {
      if (err?.code === '23505') {
        // unique_violation (email)
        this.logger.warn({ traceId, err: err?.detail }, 'Create user: conflict (unique violation)');
        throw new ConflictException({ message: 'El usuario ya existe', traceId });
      }
      this.logger.error({ traceId, err }, 'Create user: unexpected error');
      throw new InternalServerErrorException({ message: 'Error interno del servidor', traceId });
    }
  }

  /** Uso interno de Auth: devuelve ENTIDAD por email. Con withPassword=true añade passwordHash */
  async findByEmail(email: string, withPassword = false): Promise<Users | null> {
    const traceId = this.newTraceId();
    this.logger.debug({ traceId, email }, 'Find by email (entity)');

    try {
      const qb = this.userRepository.createQueryBuilder('u').where('u.email = :email', { email });

      // Si en tu entity pusieras select:false al passwordHash, aquí lo agregas.
      if (withPassword) qb.addSelect('u.passwordHash');

      const user = await qb.getOne();
      this.logger.info({ traceId, found: !!user }, 'Find by email: done');
      return user ?? null;
    } catch (err: any) {
      this.logger.error({ traceId, err }, 'Find by email: unexpected error');
      throw new InternalServerErrorException({ message: 'Error interno del servidor', traceId });
    }
  }

  // Con filtros opcionales, paginación y orden (devuelve DTOs)
  async findAll(query: UserListQueryDto): Promise<UserResponseDto[]> {
    const traceId = this.newTraceId();
    const {
      page = 1,
      limit = 20,
      sortBy = 'createdAt',
      order = 'DESC',
    } = query as any;

    this.logger.debug(
      { traceId, filters: { ...query, page, limit, sortBy, order } },
      'Find all users: start',
    );

    try {
      const qb = this.userRepository.createQueryBuilder('u');

      this.applyFilters(qb, query);

      const sortable = new Set(['name', 'lastName', 'email', 'createdAt', 'birthDate', 'role', 'status']);
      const sortField = sortable.has(sortBy) ? sortBy : 'createdAt';
      const sortOrder = order === 'ASC' ? 'ASC' : 'DESC';

      // Ojo: birthDate y lastName tienen comillas en DB si son camel, pero en entity ya están mapeados; usar alias u."birthDate" si lo necesitas.
      const orderExpr =
        sortField === 'birthDate' ? 'u."birthDate"' :
          sortField === 'lastName' ? 'u."lastName"' :
            `u.${sortField}`;

      qb.orderBy(orderExpr, sortOrder as 'ASC' | 'DESC');

      qb.skip((page - 1) * limit).take(limit);

      const users = await qb.getMany();

      this.logger.info({ traceId, count: users.length }, 'Find all users: success');
      return users.map((u) => this.toResponseDto(u));
    } catch (err: any) {
      this.logger.error({ traceId, err }, 'Find all users: unexpected error');
      throw new InternalServerErrorException({ message: 'Error interno del servidor', traceId });
    }
  }

  async findOne(id: string): Promise<UserResponseDto> { // id es text
    const traceId = this.newTraceId();
    this.logger.debug({ traceId, id }, 'Find one user: start');

    try {
      const user = await this.userRepository.findOne({ where: { id } });
      if (!user) {
        this.logger.warn({ traceId, id }, 'Find one user: not found');
        throw new NotFoundException({ message: `Usuario con id ${id} no encontrado`, traceId });
      }
      this.logger.info({ traceId, userId: user.id }, 'Find one user: success');
      return this.toResponseDto(user);
    } catch (err: any) {
      if (err?.getStatus) throw err;
      this.logger.error({ traceId, err }, 'Find one user: unexpected error');
      throw new InternalServerErrorException({ message: 'Error interno del servidor', traceId });
    }
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<UserResponseDto> {
    const traceId = this.newTraceId();
    const { password, ...rest } = updateUserDto as any;

    this.logger.info({ traceId, id, fields: Object.keys(rest ?? {}) }, 'Update user: attempt');

    try {
      const user = await this.userRepository.findOne({ where: { id } });
      if (!user) {
        this.logger.warn({ traceId, id }, 'Update user: not found');
        throw new NotFoundException({ message: `Usuario con id ${id} no encontrado`, traceId });
      }

      Object.assign(user, rest);

      if (password) {
        const rounds = Number(process.env.BCRYPT_SALT_ROUNDS ?? 10);
        this.logger.debug({ traceId, rounds }, 'Hashing password (update)');
        user.passwordHash = await bcrypt.hash(password, rounds);
      }

      await this.userRepository.save(user);

      this.logger.info({ traceId, userId: user.id }, 'Update user: success');
      return this.toResponseDto(user);
    } catch (err: any) {
      if (err?.code === '23505') {
        this.logger.warn({ traceId, err: err?.detail }, 'Update user: conflict (unique violation)');
        throw new ConflictException({ message: 'Datos en conflicto (únicos)', traceId });
      }
      if (err?.getStatus) throw err;
      this.logger.error({ traceId, err }, 'Update user: unexpected error');
      throw new InternalServerErrorException({ message: 'Error interno del servidor', traceId });
    }
  }

  async remove(id: string): Promise<void> {
    const traceId = this.newTraceId();
    this.logger.info({ traceId, id }, 'Remove user: attempt');

    try {
      const user = await this.userRepository.findOne({ where: { id } });
      if (!user) {
        this.logger.warn({ traceId, id }, 'Remove user: not found');
        throw new NotFoundException({ message: `Usuario con id ${id} no encontrado`, traceId });
      }

      await this.userRepository.remove(user);
      this.logger.info({ traceId, userId: user.id }, 'Remove user: success');
    } catch (err: any) {
      if (err?.getStatus) throw err;
      this.logger.error({ traceId, err }, 'Remove user: unexpected error');
      throw new InternalServerErrorException({ message: 'Error interno del servidor', traceId });
    }
  }
}