// src/puntos-venta/puntos-venta.service.ts
import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PinoLogger } from 'nestjs-pino';
import { randomUUID } from 'crypto';

import { PuntoVenta } from './entities/puntos-venta.entity';
import { CreatePuntosVentaDto } from './dto/create-puntos-venta.dto';
import { UpdatePuntosVentaDto } from './dto/update-puntos-venta.dto';
import { PuntosVentaListQueryDto } from './dto/puntos-venta-list-query.dto';
import { PuntosVentaResponseDto } from './dto-responses/puntos-venta-response.dto';

@Injectable()
export class PuntosVentaService {
  constructor(
    @InjectRepository(PuntoVenta)
    private readonly repo: Repository<PuntoVenta>,
    private readonly logger: PinoLogger,
  ) {
    this.logger.setContext(PuntosVentaService.name);
  }

  private newTraceId() {
    return randomUUID();
  }

  private toDto(p: PuntoVenta): PuntosVentaResponseDto {
    return {
      id: p.id,
      name: (p as any).name,
      address: (p as any).address,
      phone: (p as any).phone,
      lat: (p as any).lat,
      lng: (p as any).lng,
      status: (p as any).status,
      createdAt: (p as any).createdAt,
      updatedAt: (p as any).updatedAt,
    };
  }

  async create(dto: CreatePuntosVentaDto): Promise<PuntosVentaResponseDto> {
    const traceId = this.newTraceId();
    this.logger.info({ traceId, name: dto.name }, 'Create PV: attempt');

    try {
      const entity = this.repo.create({
        id: randomUUID(),
        ...dto,
      } as Partial<PuntoVenta>);

      const saved = await this.repo.save(entity);
      this.logger.info({ traceId, id: saved.id }, 'Create PV: success');
      return this.toDto(saved);
    } catch (err: any) {
      if (err?.code === '23505') {
        this.logger.warn({ traceId, err: err?.detail }, 'Create PV: conflict (unique)');
        throw new ConflictException({ message: 'Conflicto de datos únicos', traceId });
      }
      this.logger.error({ traceId, err }, 'Create PV: unexpected error');
      throw new InternalServerErrorException({ message: 'Error interno del servidor', traceId });
    }
  }

  async findAll(q: PuntosVentaListQueryDto): Promise<PuntosVentaResponseDto[]> {
    const traceId = this.newTraceId();
    const {
      name,
      address,
      phone,
      status,
      page = 1,
      limit = 20,
      sortBy = 'createdAt',
      order = 'DESC',
    } = q ?? {};

    this.logger.debug(
      { traceId, filters: { name, address, phone, status, page, limit, sortBy, order } },
      'Find PV: start',
    );

    try {
      const qb = this.repo.createQueryBuilder('pv');

      if (name) qb.andWhere('pv.name ILIKE :name', { name: `%${name}%` });
      if (address) qb.andWhere('pv.address ILIKE :address', { address: `%${address}%` });
      if (phone) qb.andWhere('pv.phone ILIKE :phone', { phone: `%${phone}%` });
      if (typeof status === 'boolean') qb.andWhere('pv.status = :status', { status });

      const sortable = new Set(['createdAt', 'updatedAt', 'name', 'address', 'status']);
      const field = sortable.has(sortBy || '') ? sortBy : 'createdAt';
      const dir = order === 'ASC' ? 'ASC' : 'DESC';

      const orderExpr =
        field === 'createdAt' ? 'pv.createdAt' :
          field === 'updatedAt' ? 'pv.updatedAt' :
            `pv.${field}`;

      qb.orderBy(orderExpr, dir as 'ASC' | 'DESC');
      qb.skip((page - 1) * limit).take(limit);

      const rows = await qb.getMany();
      this.logger.info({ traceId, count: rows.length }, 'Find PV: success');

      return rows.map((p) => this.toDto(p));
    } catch (err: any) {
      this.logger.error({ traceId, err }, 'Find PV: unexpected error');
      throw new InternalServerErrorException({ message: 'Error interno del servidor', traceId });
    }
  }

  async findOne(id: string): Promise<PuntosVentaResponseDto> {
    const traceId = this.newTraceId();
    this.logger.debug({ traceId, id }, 'FindOne PV: start');

    try {
      const pv = await this.repo.findOne({ where: { id } });
      if (!pv) {
        this.logger.warn({ traceId, id }, 'FindOne PV: not found');
        throw new NotFoundException({ message: `Punto de venta ${id} no encontrado`, traceId });
      }
      this.logger.info({ traceId, id }, 'FindOne PV: success');
      return this.toDto(pv);
    } catch (err: any) {
      if (err?.getStatus) throw err;
      this.logger.error({ traceId, err }, 'FindOne PV: unexpected error');
      throw new InternalServerErrorException({ message: 'Error interno del servidor', traceId });
    }
  }

  async update(id: string, dto: UpdatePuntosVentaDto): Promise<PuntosVentaResponseDto> {
    const traceId = this.newTraceId();
    this.logger.info({ traceId, id, fields: Object.keys(dto ?? {}) }, 'Update PV: attempt');

    try {
      const pv = await this.repo.findOne({ where: { id } });
      if (!pv) {
        this.logger.warn({ traceId, id }, 'Update PV: not found');
        throw new NotFoundException({ message: `Punto de venta ${id} no encontrado`, traceId });
      }

      Object.assign(pv, dto);
      const saved = await this.repo.save(pv);

      this.logger.info({ traceId, id }, 'Update PV: success');
      return this.toDto(saved);
    } catch (err: any) {
      if (err?.code === '23505') {
        this.logger.warn({ traceId, err: err?.detail }, 'Update PV: conflict');
        throw new ConflictException({ message: 'Conflicto de datos únicos', traceId });
      }
      if (err?.getStatus) throw err;
      this.logger.error({ traceId, err }, 'Update PV: unexpected error');
      throw new InternalServerErrorException({ message: 'Error interno del servidor', traceId });
    }
  }

  async remove(id: string): Promise<void> {
    const traceId = this.newTraceId();
    this.logger.info({ traceId, id }, 'Remove PV: attempt');

    try {
      const pv = await this.repo.findOne({ where: { id } });
      if (!pv) {
        this.logger.warn({ traceId, id }, 'Remove PV: not found');
        throw new NotFoundException({ message: `Punto de venta ${id} no encontrado`, traceId });
      }
      await this.repo.remove(pv);
      this.logger.info({ traceId, id }, 'Remove PV: success');
    } catch (err: any) {
      if (err?.getStatus) throw err;
      this.logger.error({ traceId, err }, 'Remove PV: unexpected error');
      throw new InternalServerErrorException({ message: 'Error interno del servidor', traceId });
    }
  }
}