// src/operador-pdv/operador-pdv.service.ts
import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { PinoLogger } from 'nestjs-pino';
import { randomUUID } from 'crypto';

import { CreateOperadorPdvDto } from './dto/create-operador-pdv.dto';
import { UpdateOperadorPdvDto } from './dto/update-operador-pdv.dto';
import { OperadorPdv } from './entities/operador-pdv.entity';

// (opcional) mover esto a src/operador-pdv/dto-response/operador-pdv-response.dto.ts
class OperadorPdvResponseDto {
  operadorId!: string;
  puntoVentaId!: string;
  assignedAt!: string; // text en DB
  enabled!: boolean;
}

class OperadorPdvListQueryDto {
  operadorId?: string;
  puntoVentaId?: string;
  enabled?: boolean;
  page?: number = 1;
  limit?: number = 20;
  sortBy?: 'assignedAt' | 'operadorId' | 'puntoVentaId' | 'enabled' = 'assignedAt';
  order?: 'ASC' | 'DESC' = 'DESC';
}

@Injectable()
export class OperadorPdvService {
  constructor(
    private readonly dataSource: DataSource,
    @InjectRepository(OperadorPdv)
    private readonly repo: Repository<OperadorPdv>,
    private readonly logger: PinoLogger,
  ) {
    this.logger.setContext(OperadorPdvService.name);
  }

  private newTraceId() {
    return randomUUID();
  }

  private toDto(row: OperadorPdv): OperadorPdvResponseDto {
    const r = row as any;
    return {
      operadorId: r.operadorId ?? r.operador_id ?? (r.operador?.id ?? ''),
      puntoVentaId: r.puntoVentaId ?? r.punto_venta_id ?? (r.puntoVenta?.id ?? ''),
      assignedAt: r.assigned_at ?? r.assignedAt,
      enabled: !!r.enabled,
    };
  }

  async create(dto: CreateOperadorPdvDto): Promise<OperadorPdvResponseDto> {
    const traceId = this.newTraceId();
    const { operadorId, puntoVentaId, enabled = true } = dto as any;

    this.logger.info({ traceId, operadorId, puntoVentaId }, 'Create operador_pdv: attempt');

    try {
      // Si tu Entity define relaciones, puedes setear como objetos { id }
      const entity = this.repo.create({
        operador: { id: operadorId } as any,
        puntoVenta: { id: puntoVentaId } as any,
        enabled,
      } as Partial<OperadorPdv>);

      const saved = await this.repo.save(entity);

      this.logger.info({ traceId, operadorId, puntoVentaId }, 'Create operador_pdv: success');
      return this.toDto(saved);
    } catch (err: any) {
      if (err?.code === '23505') {
        this.logger.warn({ traceId, err: err?.detail }, 'Create operador_pdv: conflict (unique/PK)');
        throw new ConflictException({
          message: 'La asignación operador-pdv ya existe',
          traceId,
        });
      }
      this.logger.error({ traceId, err }, 'Create operador_pdv: unexpected error');
      throw new InternalServerErrorException({
        message: 'Error interno del servidor',
        traceId,
      });
    }
  }

  async createMany(dtos: CreateOperadorPdvDto[]): Promise<OperadorPdvResponseDto[]> {
    const traceId = this.newTraceId();
    this.logger.info({ traceId, count: dtos?.length ?? 0 }, 'CreateMany operador_pdv: attempt');

    const qr = this.dataSource.createQueryRunner();
    await qr.connect();
    await qr.startTransaction();

    try {
      const repo = qr.manager.getRepository(OperadorPdv);
      const entities = dtos.map((d: any) =>
        repo.create({
          operador: { id: d.operadorId } as any,
          puntoVenta: { id: d.puntoVentaId } as any,
          enabled: d.enabled ?? true,
        } as Partial<OperadorPdv>),
      );

      const saved = await repo.save(entities);
      await qr.commitTransaction();

      this.logger.info({ traceId, count: saved.length }, 'CreateMany operador_pdv: success');
      return saved.map((s) => this.toDto(s));
    } catch (err: any) {
      await qr.rollbackTransaction();
      if (err?.code === '23505') {
        this.logger.warn({ traceId, err: err?.detail }, 'CreateMany operador_pdv: conflict');
        throw new ConflictException({
          message: 'Alguna asignación ya existe (PK duplicada)',
          traceId,
        });
      }
      this.logger.error({ traceId, err }, 'CreateMany operador_pdv: unexpected error');
      throw new InternalServerErrorException({
        message: 'Error interno del servidor',
        traceId,
      });
    } finally {
      await qr.release();
    }
  }

  async findAll(q: OperadorPdvListQueryDto = {}): Promise<OperadorPdvResponseDto[]> {
    const traceId = this.newTraceId();
    const {
      operadorId,
      puntoVentaId,
      enabled,
      page = 1,
      limit = 20,
      sortBy = 'assignedAt',
      order = 'DESC',
    } = q;

    this.logger.debug(
      { traceId, filters: { operadorId, puntoVentaId, enabled, page, limit, sortBy, order } },
      'Find operador_pdv: start',
    );

    try {
      const qb = this.repo.createQueryBuilder('op')
        .leftJoin('op.operador', 'u')
        .leftJoin('op.puntoVenta', 'pv');

      if (operadorId) qb.andWhere('u.id = :operadorId', { operadorId });
      if (puntoVentaId) qb.andWhere('pv.id = :puntoVentaId', { puntoVentaId });
      if (typeof enabled === 'boolean') qb.andWhere('op.enabled = :enabled', { enabled });

      // Campos de orden soportados
      let orderExpr = 'op.assigned_at';
      if (sortBy === 'operadorId') orderExpr = 'u.id';
      else if (sortBy === 'puntoVentaId') orderExpr = 'pv.id';
      else if (sortBy === 'enabled') orderExpr = 'op.enabled';

      const dir = order === 'ASC' ? 'ASC' : 'DESC';
      qb.orderBy(orderExpr, dir as 'ASC' | 'DESC');

      qb.skip((page - 1) * limit).take(limit);

      const rows = await qb.getMany();

      this.logger.info({ traceId, count: rows.length }, 'Find operador_pdv: success');
      return rows.map((r) => this.toDto(r));
    } catch (err: any) {
      this.logger.error({ traceId, err }, 'Find operador_pdv: unexpected error');
      throw new InternalServerErrorException({
        message: 'Error interno del servidor',
        traceId,
      });
    }
  }

  async findOne(operadorId: string, puntoVentaId: string): Promise<OperadorPdvResponseDto> {
    const traceId = this.newTraceId();
    this.logger.debug({ traceId, operadorId, puntoVentaId }, 'FindOne operador_pdv: start');

    try {
      const row = await this.repo.findOne({
        where: {
          operador: { id: operadorId } as any,
          puntoVenta: { id: puntoVentaId } as any,
        } as any,
        relations: { operador: true, puntoVenta: true },
      });

      if (!row) {
        this.logger.warn({ traceId, operadorId, puntoVentaId }, 'FindOne operador_pdv: not found');
        throw new NotFoundException({
          message: `Asignación no encontrada (${operadorId} -> ${puntoVentaId})`,
          traceId,
        });
      }

      this.logger.info({ traceId, operadorId, puntoVentaId }, 'FindOne operador_pdv: success');
      return this.toDto(row);
    } catch (err: any) {
      if (err?.getStatus) throw err;
      this.logger.error({ traceId, err }, 'FindOne operador_pdv: unexpected error');
      throw new InternalServerErrorException({ message: 'Error interno del servidor', traceId });
    }
  }

  async update(
    operadorId: string,
    puntoVentaId: string,
    dto: UpdateOperadorPdvDto,
  ): Promise<OperadorPdvResponseDto> {
    const traceId = this.newTraceId();
    this.logger.info({ traceId, operadorId, puntoVentaId, fields: Object.keys(dto ?? {}) }, 'Update operador_pdv: attempt');

    try {
      const row = await this.repo.findOne({
        where: {
          operador: { id: operadorId } as any,
          puntoVenta: { id: puntoVentaId } as any,
        } as any,
        relations: { operador: true, puntoVenta: true },
      });

      if (!row) {
        this.logger.warn({ traceId, operadorId, puntoVentaId }, 'Update operador_pdv: not found');
        throw new NotFoundException({
          message: `Asignación no encontrada (${operadorId} -> ${puntoVentaId})`,
          traceId,
        });
      }

      if (dto.enabled !== undefined) (row as any).enabled = dto.enabled;
      // Si decides permitir mover a otro pdv/operador, aquí habría que manejar PK compuesta con transacción.

      await this.repo.save(row);

      this.logger.info({ traceId, operadorId, puntoVentaId }, 'Update operador_pdv: success');
      return this.toDto(row);
    } catch (err: any) {
      if (err?.code === '23505') {
        this.logger.warn({ traceId, err: err?.detail }, 'Update operador_pdv: conflict');
        throw new ConflictException({ message: 'Conflicto de datos', traceId });
      }
      if (err?.getStatus) throw err;
      this.logger.error({ traceId, err }, 'Update operador_pdv: unexpected error');
      throw new InternalServerErrorException({ message: 'Error interno del servidor', traceId });
    }
  }

  async remove(operadorId: string, puntoVentaId: string): Promise<void> {
    const traceId = this.newTraceId();
    this.logger.info({ traceId, operadorId, puntoVentaId }, 'Remove operador_pdv: attempt');

    try {
      const row = await this.repo.findOne({
        where: {
          operador: { id: operadorId } as any,
          puntoVenta: { id: puntoVentaId } as any,
        } as any,
      });

      if (!row) {
        this.logger.warn({ traceId, operadorId, puntoVentaId }, 'Remove operador_pdv: not found');
        throw new NotFoundException({
          message: `Asignación no encontrada (${operadorId} -> ${puntoVentaId})`,
          traceId,
        });
      }

      await this.repo.remove(row);
      this.logger.info({ traceId, operadorId, puntoVentaId }, 'Remove operador_pdv: success');
    } catch (err: any) {
      if (err?.getStatus) throw err;
      this.logger.error({ traceId, err }, 'Remove operador_pdv: unexpected error');
      throw new InternalServerErrorException({ message: 'Error interno del servidor', traceId });
    }
  }
}