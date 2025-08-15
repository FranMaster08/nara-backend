import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';
import { Repository, DataSource } from 'typeorm';
import { randomUUID } from 'crypto';

import { Producto } from './entities/producto.entity';
import { CreateProductoDto } from './dto/create-producto.dto';
import { UpdateProductoDto } from './dto/update-producto.dto';
import { ProductoResponseDto } from './dto-responses/producto-response.dto';
import { ProductoListQueryDto } from './dto/producto-list-query.dto';

@Injectable()
export class ProductosService {
  constructor(
    private readonly dataSource: DataSource,
    @InjectRepository(Producto)
    private readonly productoRepo: Repository<Producto>,
    @InjectPinoLogger(ProductosService.name) private readonly logger: PinoLogger,
  ) { }

  private newTraceId(): string {
    return randomUUID();
  }

  private toDto(p: Producto): ProductoResponseDto {
    return {
      id: p.id,
      nombre: p.nombre,
      precio_unitario: p.precio_unitario,
      sku: p.sku ?? null,
      status: p.status,
      createdAt: p.createdAt,
      updatedAt: p.updatedAt,
    };
  }

  async create(dto: CreateProductoDto): Promise<ProductoResponseDto> {
    const traceId = this.newTraceId();
    this.logger.info({ traceId, id: dto.id, sku: dto.sku }, 'Create producto: attempt');

    try {
      const entity = this.productoRepo.create({
        ...dto,
      });

      await this.productoRepo.save(entity);
      this.logger.info({ traceId, id: entity.id }, 'Create producto: success');

      return this.toDto(entity);
    } catch (err: any) {
      if (err?.code === '23505') {
        // unique_violation (SKU)
        this.logger.warn({ traceId, err: err?.detail }, 'Create producto: conflict (unique)');
        throw new ConflictException({
          message: 'Conflicto de datos (SKU o ID duplicado)',
          traceId,
        });
      }
      this.logger.error({ traceId, err }, 'Create producto: unexpected error');
      throw new InternalServerErrorException({
        message: 'Error interno del servidor',
        traceId,
      });
    }
  }

  /**
   * Ejemplo de inserción masiva con transacción explícita (multi-row).
   * Útil cuando necesites garantías atómicas o side-effects en varias tablas.
   */
  async createMany(dtos: CreateProductoDto[]): Promise<ProductoResponseDto[]> {
    const traceId = this.newTraceId();
    this.logger.info({ traceId, count: dtos?.length ?? 0 }, 'Create productos (bulk): attempt');

    const qr = this.dataSource.createQueryRunner();
    await qr.connect();
    await qr.startTransaction();

    try {
      const repo = qr.manager.getRepository(Producto);
      const entities = repo.create(dtos);
      const saved = await repo.save(entities);

      await qr.commitTransaction();
      this.logger.info({ traceId, count: saved.length }, 'Create productos (bulk): success');

      return saved.map((p) => this.toDto(p));
    } catch (err: any) {
      await qr.rollbackTransaction();
      if (err?.code === '23505') {
        this.logger.warn({ traceId, err: err?.detail }, 'Create productos (bulk): conflict');
        throw new ConflictException({
          message: 'Conflicto de datos (IDs/SKUs duplicados en lote)',
          traceId,
        });
      }
      this.logger.error({ traceId, err }, 'Create productos (bulk): unexpected error');
      throw new InternalServerErrorException({
        message: 'Error interno del servidor',
        traceId,
      });
    } finally {
      await qr.release();
    }
  }

  async findAll(q: ProductoListQueryDto): Promise<ProductoResponseDto[]> {
    const traceId = this.newTraceId();
    const {
      nombre,
      sku,
      status,
      precioMin,
      precioMax,
      page = 1,
      limit = 20,
      sortBy = 'createdAt',
      order = 'DESC',
    } = q;

    this.logger.debug(
      {
        traceId,
        filters: { nombre, sku, status, precioMin, precioMax, page, limit, sortBy, order },
      },
      'Find productos: start',
    );

    try {
      const qb = this.productoRepo.createQueryBuilder('p');

      if (nombre) qb.andWhere('p.nombre ILIKE :nombre', { nombre: `%${nombre}%` });
      if (sku) qb.andWhere('p.sku ILIKE :sku', { sku: `%${sku}%` });
      if (typeof status === 'boolean') qb.andWhere('p.status = :status', { status });

      // Como precio_unitario es numeric, comparar como numeric
      if (precioMin) qb.andWhere("p.precio_unitario::numeric >= :min", { min: precioMin });
      if (precioMax) qb.andWhere("p.precio_unitario::numeric <= :max", { max: precioMax });

      const sortable = new Set(['nombre', 'precio_unitario', 'createdAt', 'updatedAt', 'sku']);
      const field = sortable.has(sortBy || '') ? sortBy : 'createdAt';
      const dir = order === 'ASC' ? 'ASC' : 'DESC';
      qb.orderBy(`p.${field}`, dir as 'ASC' | 'DESC');

      qb.skip((page - 1) * limit).take(limit);

      const rows = await qb.getMany();
      this.logger.info({ traceId, count: rows.length }, 'Find productos: success');

      return rows.map((p) => this.toDto(p));
    } catch (err: any) {
      this.logger.error({ traceId, err }, 'Find productos: unexpected error');
      throw new InternalServerErrorException({
        message: 'Error interno del servidor',
        traceId,
      });
    }
  }

  async findOne(id: string): Promise<ProductoResponseDto> {
    const traceId = this.newTraceId();
    this.logger.debug({ traceId, id }, 'Find producto: start');

    try {
      const p = await this.productoRepo.findOne({ where: { id } });
      if (!p) {
        this.logger.warn({ traceId, id }, 'Find producto: not found');
        throw new NotFoundException({ message: `Producto ${id} no encontrado`, traceId });
      }
      this.logger.info({ traceId, id: p.id }, 'Find producto: success');
      return this.toDto(p);
    } catch (err: any) {
      if (err?.getStatus) throw err;
      this.logger.error({ traceId, err }, 'Find producto: unexpected error');
      throw new InternalServerErrorException({
        message: 'Error interno del servidor',
        traceId,
      });
    }
  }

  async update(id: string, dto: UpdateProductoDto): Promise<ProductoResponseDto> {
    const traceId = this.newTraceId();
    this.logger.info({ traceId, id, fields: Object.keys(dto ?? {}) }, 'Update producto: attempt');

    try {
      const p = await this.productoRepo.findOne({ where: { id } });
      if (!p) {
        this.logger.warn({ traceId, id }, 'Update producto: not found');
        throw new NotFoundException({ message: `Producto ${id} no encontrado`, traceId });
      }

      Object.assign(p, dto);
      await this.productoRepo.save(p);

      this.logger.info({ traceId, id: p.id }, 'Update producto: success');
      return this.toDto(p);
    } catch (err: any) {
      if (err?.code === '23505') {
        this.logger.warn({ traceId, err: err?.detail }, 'Update producto: conflict (unique)');
        throw new ConflictException({
          message: 'Conflicto de datos (SKU duplicado)',
          traceId,
        });
      }
      if (err?.getStatus) throw err;
      this.logger.error({ traceId, err }, 'Update producto: unexpected error');
      throw new InternalServerErrorException({
        message: 'Error interno del servidor',
        traceId,
      });
    }
  }

  async remove(id: string): Promise<void> {
    const traceId = this.newTraceId();
    this.logger.info({ traceId, id }, 'Remove producto: attempt');

    try {
      const p = await this.productoRepo.findOne({ where: { id } });
      if (!p) {
        this.logger.warn({ traceId, id }, 'Remove producto: not found');
        throw new NotFoundException({ message: `Producto ${id} no encontrado`, traceId });
      }

      await this.productoRepo.remove(p);
      this.logger.info({ traceId, id: p.id }, 'Remove producto: success');
    } catch (err: any) {
      if (err?.getStatus) throw err;
      this.logger.error({ traceId, err }, 'Remove producto: unexpected error');
      throw new InternalServerErrorException({
        message: 'Error interno del servidor',
        traceId,
      });
    }
  }
}