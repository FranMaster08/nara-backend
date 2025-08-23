import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, In, Repository } from 'typeorm';
import { PinoLogger } from 'nestjs-pino';
import { randomUUID } from 'crypto';

import { Pedido } from './entities/pedido.entity';
import { LineaPedido } from './entities/linea-pedido.entity';
import { Producto } from '../productos/entities/producto.entity';
import { CreatePedidoDto } from './dto/create-pedido.dto';
import { PedidoListQueryDto } from './dto/pedido-list-query.dto';
import { UpdatePedidoDto } from './dto/update-pedido.dto';
import { PedidoResponseDto } from './dto-responses/pedido-response.dto'; // 👈 usa el DTO correcto (no el de operador-pdv)

@Injectable()
export class PedidosService {
  constructor(
    private readonly dataSource: DataSource,
    @InjectRepository(Pedido) private readonly pedidoRepo: Repository<Pedido>,
    @InjectRepository(LineaPedido) private readonly lineaRepo: Repository<LineaPedido>,
    @InjectRepository(Producto) private readonly productoRepo: Repository<Producto>,
    private readonly logger: PinoLogger,
  ) {
    this.logger.setContext(PedidosService.name);
  }

  private newTraceId() {
    return randomUUID();
  }

  private toDto(p: Pedido & { lineas?: LineaPedido[] }): PedidoResponseDto {
    return {
      id: p.id,
      codigo: p.codigo,
      estado: p.estado,
      notas: (p as any).notas ?? null,
      status: (p as any).status,
      createdAt: (p as any).createdAt,
      updatedAt: (p as any).updatedAt,
      createBy: (p as any).createBy,
      userId: (p as any).userId ?? null,
      puntoVentaId: (p as any).puntoVentaId ?? null,
      lineas: (p.lineas).map((l) => ({
        id: l.id,
        productoId: (l as any).productoId!,
        cantidad: l.cantidad,
        // DTO usa camelCase:
        precioUnitarioSnapshot: l.precio_unitario_snapshot !== null && l.precio_unitario_snapshot !== undefined
          ? Number(l.precio_unitario_snapshot as any)
          : null,
        subtotalSnapshot: l.subtotal_snapshot !== null && l.subtotal_snapshot !== undefined
          ? Number(l.subtotal_snapshot as any)
          : null,
      })),
    };
  }

  /** Valida existencia de productos y devuelve mapa productoId -> precio_unitario (string) */
  private async fetchPreciosProducto(
    productoIds: string[],
    traceId: string,
  ): Promise<Map<string, string>> {
    const uniq = Array.from(new Set(productoIds));
    const prods = uniq.length ? await this.productoRepo.find({ where: { id: In(uniq) } }) : [];
    if (prods.length !== uniq.length) {
      const found = new Set(prods.map((p) => p.id));
      const missing = uniq.filter((id) => !found.has(id));
      this.logger.warn({ traceId, missing }, 'Productos no encontrados');
      throw new NotFoundException({
        message: `Productos no encontrados: ${missing.join(', ')}`,
        traceId,
      });
    }
    const map = new Map<string, string>();
    prods.forEach((p) => map.set(p.id, String(p.precio_unitario)));
    return map;
  }

  async create(dto: CreatePedidoDto): Promise<PedidoResponseDto> {
    const traceId = this.newTraceId();
    this.logger.info({ traceId, codigo: dto.codigo, lineas: dto.lineas?.length }, 'Create pedido: attempt');

    const qr = this.dataSource.createQueryRunner();
    await qr.connect();
    await qr.startTransaction();

    try {
      // Validar productos y calcular snapshots
      const productoIds = dto.lineas.map((l) => l.productoId);
      const precios = await this.fetchPreciosProducto(productoIds, traceId);

      const pedido = qr.manager.getRepository(Pedido).create({
        codigo: dto.codigo,
        estado: dto.estado,
        notas: dto.notas ?? null,
        status: dto.status ?? true,
        createBy: dto.createBy,
        user: dto.userId ? ({ id: dto.userId } as any) : null,
        puntoVenta: { id: dto.puntoVentaId } ,
      } );

      await qr.manager.getRepository(Pedido).save(pedido);

      const lineas = dto.lineas.map((l) => {
        const precio = precios.get(l.productoId)!; // ya validado
        const subtotal = (Number(precio) * l.cantidad).toString();
        return qr.manager.getRepository(LineaPedido).create({
          id: randomUUID(),
          cantidad: l.cantidad,
          precio_unitario_snapshot: precio,
          subtotal_snapshot: subtotal,
          pedido: { id: pedido.id },
          producto: { id: l.productoId } ,
        });
      });

      if (lineas.length) {
        await qr.manager.getRepository(LineaPedido).save(lineas); // 👈 guarda TODAS
      }

      await qr.commitTransaction();

      const withLines = await this.pedidoRepo.findOne({
        where: { id: pedido.id },
        relations: { lineas: true },
      });

      this.logger.info({ traceId, id: pedido.id }, 'Create pedido: success');
      return this.toDto(withLines!);
    } catch (err: any) {
      await qr.rollbackTransaction();
      this.logger.error({ traceId, err }, 'Create pedido: unexpected error');
      throw new InternalServerErrorException({ message: 'Error interno del servidor', traceId });
    } finally {
      await qr.release();
    }
  }

  async findAll(q: PedidoListQueryDto): Promise<PedidoResponseDto[]> {
    const traceId = this.newTraceId();
    const {
      codigo,
      estado,
      userId,
      puntoVentaId,
      status,
      page = 1,
      limit = 20,
      sortBy = 'createdAt',
      order = 'DESC',
    } = q;

    this.logger.debug(
      { traceId, filters: { codigo, estado, userId, puntoVentaId, status, page, limit, sortBy, order } },
      'Find pedidos: start',
    );

    try {
      const qb = this.pedidoRepo.createQueryBuilder('p');

      if (codigo) qb.andWhere('p.codigo ILIKE :codigo', { codigo: `%${codigo}%` });
      if (estado) qb.andWhere('p.estado = :estado', { estado });
      if (userId) qb.andWhere('p."userId" = :userId', { userId });
      if (puntoVentaId) qb.andWhere('p."puntoVentaId" = :puntoVentaId', { puntoVentaId });
      if (typeof status === 'boolean') qb.andWhere('p.status = :status', { status });

      const sortable = new Set(['codigo', 'estado', 'createdAt', 'updatedAt']);
      const field = sortable.has(sortBy || '') ? sortBy : 'createdAt';
      const dir = order === 'ASC' ? 'ASC' : 'DESC';

      const orderExpr =
        field === 'createdAt' ? 'p.createdAt' :
          field === 'updatedAt' ? 'p.updatedAt' :
            `p.${field}`;

      qb.orderBy(orderExpr, dir as 'ASC' | 'DESC');
      qb.skip((page - 1) * limit).take(limit);

      const rows = await qb.getMany();

      this.logger.info({ traceId, count: rows.length }, 'Find pedidos: success');

      // Por performance, sin líneas en listado (puedes cambiarlos a find con relations si quieres).
      return rows.map((p) => this.toDto({ ...p, lineas: [] } as any));
    } catch (err: any) {
      this.logger.error({ traceId, err }, 'Find pedidos: unexpected error');
      throw new InternalServerErrorException({ message: 'Error interno del servidor', traceId });
    }
  }

  async findOne(id: string): Promise<PedidoResponseDto> {
    const traceId = this.newTraceId();
    this.logger.debug({ traceId, id }, 'Find pedido: start');

    try {
      const p = await this.pedidoRepo.findOne({
        where: { id },
        relations: { lineas: true },
      });
      if (!p) {
        this.logger.warn({ traceId, id }, 'Find pedido: not found');
        throw new NotFoundException({ message: `Pedido ${id} no encontrado`, traceId });
      }
      this.logger.info({ traceId, id }, 'Find pedido: success');
      return this.toDto(p);
    } catch (err: any) {
      if (err?.getStatus) throw err;
      this.logger.error({ traceId, err }, 'Find pedido: unexpected error');
      throw new InternalServerErrorException({ message: 'Error interno del servidor', traceId });
    }
  }

  async update(id: string, dto: UpdatePedidoDto): Promise<PedidoResponseDto> {
    const traceId = this.newTraceId();
    this.logger.info({ traceId, id, fields: Object.keys(dto ?? {}) }, 'Update pedido: attempt');

    const qr = this.dataSource.createQueryRunner();
    await qr.connect();
    await qr.startTransaction();

    try {
      const repo = qr.manager.getRepository(Pedido);
      const lpRepo = qr.manager.getRepository(LineaPedido);

      const pedido = await repo.findOne({ where: { id }, relations: { lineas: true } });
      if (!pedido) {
        this.logger.warn({ traceId, id }, 'Update pedido: not found');
        throw new NotFoundException({ message: `Pedido ${id} no encontrado`, traceId });
      }

      // Actualizar encabezado
      if (dto.codigo !== undefined) pedido.codigo = dto.codigo;
      if (dto.estado !== undefined) pedido.estado = dto.estado;
      if (dto.notas !== undefined) pedido.notas = dto.notas ?? null;
      if (dto.status !== undefined) (pedido as any).status = dto.status;
      if (dto.userId !== undefined) (pedido as any).user = dto.userId ? ({ id: dto.userId } as any) : null;
      if (dto.puntoVentaId !== undefined) (pedido as any).puntoVenta = dto.puntoVentaId ? ({ id: dto.puntoVentaId } as any) : null;
      if (dto.createBy !== undefined) (pedido as any).createBy = dto.createBy;

      // Reemplazo total de líneas (opcional)
      if (dto.lineas) {
        const productoIds = dto.lineas.filter(l => l.productoId).map(l => l.productoId!);
        const precios = productoIds.length ? await this.fetchPreciosProducto(productoIds, traceId) : new Map<string, string>();

        // Borrar actuales
        if (pedido.lineas?.length) {
          await lpRepo.delete({ pedido: { id: pedido.id } as any });
        }

        // Crear nuevas
        const nuevas = (dto.lineas || []).map((l) => {
          const prodId = l.productoId!;
          const cantidad = l.cantidad ?? 1;
          const precio = prodId ? (precios.get(prodId) ?? '0') : '0';
          const subtotal = (Number(precio) * cantidad).toString();
          return lpRepo.create({
            id: randomUUID(),
            cantidad,
            precio_unitario_snapshot: precio,
            subtotal_snapshot: subtotal,
            pedido: { id: pedido.id } as any,
            producto: prodId ? ({ id: prodId } as any) : null, // productoId opcional en UpdateLineaDto
          } as any);
        });

        if (nuevas.length) {
          await lpRepo.save(nuevas[0]); // 👈 guarda TODAS
        }
      }

      await repo.save(pedido);
      await qr.commitTransaction();

      const withLines = await this.pedidoRepo.findOne({ where: { id }, relations: { lineas: true } });
      this.logger.info({ traceId, id }, 'Update pedido: success');
      return this.toDto(withLines!);
    } catch (err: any) {
      await qr.rollbackTransaction();
      if (err?.code === '23505') {
        this.logger.warn({ traceId, err: err?.detail }, 'Update pedido: conflict');
        throw new ConflictException({ message: 'Conflicto de datos', traceId });
      }
      if (err?.getStatus) throw err;
      this.logger.error({ traceId, err }, 'Update pedido: unexpected error');
      throw new InternalServerErrorException({ message: 'Error interno del servidor', traceId });
    } finally {
      await qr.release();
    }
  }

  async remove(id: string): Promise<void> {
    const traceId = this.newTraceId();
    this.logger.info({ traceId, id }, 'Remove pedido: attempt');

    try {
      const pedido = await this.pedidoRepo.findOne({ where: { id } });
      if (!pedido) {
        this.logger.warn({ traceId, id }, 'Remove pedido: not found');
        throw new NotFoundException({ message: `Pedido ${id} no encontrado`, traceId });
      }
      await this.pedidoRepo.remove(pedido);
      this.logger.info({ traceId, id }, 'Remove pedido: success');
    } catch (err: any) {
      if (err?.getStatus) throw err;
      this.logger.error({ traceId, err }, 'Remove pedido: unexpected error');
      throw new InternalServerErrorException({ message: 'Error interno del servidor', traceId });
    }
  }
}