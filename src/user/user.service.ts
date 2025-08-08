import { Injectable, NotFoundException, Logger, HttpException, HttpStatus } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Users } from './entities/user.entity';
import { UserResponseDto } from './dto-responses/user-response.dto';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  constructor(
    @InjectRepository(Users)
    private readonly userRepository: Repository<Users>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<UserResponseDto> {
    const traceId = uuidv4();
    // Log entrada al método con datos relevantes, excluyendo password
    this.logger.log(
      `[${traceId}] [ENTRY] create() with data: name=${createUserDto.name}, email=${createUserDto.email}` +
      (createUserDto.age !== undefined ? `, age=${createUserDto.age}` : '')
    );
    try {
      const user = this.userRepository.create(createUserDto);
      await this.userRepository.save(user);
      this.logger.log(`[${traceId}] Usuario creado: ${user.email}`);
      return this.toResponseDto(user);
    } catch (error) {
      this.logger.error(`[${traceId}] Error al crear usuario: ${error.message}`);
      throw new HttpException(`[${traceId}] Error al crear usuario`, HttpStatus.BAD_REQUEST);
    }
  }

  async findAll(): Promise<UserResponseDto[]> {
    const traceId = uuidv4();
    // Log entrada al método
    this.logger.log(`[${traceId}] [ENTRY] findAll() invoked`);
    const users = await this.userRepository.find();
    return users.map(u => this.toResponseDto(u));
  }

  async findOne(id: number): Promise<UserResponseDto> {
    const traceId = uuidv4();
    // Log entrada al método con id
    this.logger.log(`[${traceId}] [ENTRY] findOne() with id=${id}`);
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      this.logger.warn(`[${traceId}] Usuario no encontrado: ${id}`);
      throw new NotFoundException(`[${traceId}] Usuario con id ${id} no encontrado`);
    }
    this.logger.log(`[${traceId}] Usuario encontrado: ${user.email}`);
    return this.toResponseDto(user);
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<UserResponseDto> {
    const traceId = uuidv4();
    // Log entrada al método con campos relevantes (excluyendo password)
    const { password, ...safeFields } = updateUserDto as any;
    const safeFieldsStr = Object.entries(safeFields)
      .map(([key, val]) => `${key}=${val}`)
      .join(', ');
    this.logger.log(`[${traceId}] [ENTRY] update() with id=${id}, fields: ${safeFieldsStr}`);
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      this.logger.warn(`[${traceId}] Usuario no encontrado: ${id}`);
      throw new NotFoundException(`[${traceId}] Usuario con id ${id} no encontrado`);
    }
    Object.assign(user, updateUserDto);
    await this.userRepository.save(user);
    this.logger.log(`[${traceId}] Usuario actualizado: ${user.email}`);
    return this.toResponseDto(user);
  }

  async remove(id: number): Promise<void> {
    const traceId = uuidv4();
    // Log entrada al método con id
    this.logger.log(`[${traceId}] [ENTRY] remove() with id=${id}`);
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      this.logger.warn(`[${traceId}] Usuario no encontrado: ${id}`);
      throw new NotFoundException(`[${traceId}] Usuario con id ${id} no encontrado`);
    }
    await this.userRepository.remove(user);
    this.logger.log(`[${traceId}] Usuario eliminado: ${user.email}`);
  }

  private toResponseDto(user: Users): UserResponseDto {
    const { id, name, email, age } = user;
    return { id, name, email, age };
  }
}
