// src/pedidos/pedidos.controller.ts
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

import { PedidosService } from './pedidos.service';
import { CreatePedidoDto } from './dto/create-pedido.dto';
import { UpdatePedidoDto } from './dto/update-pedido.dto';
import { PedidoListQueryDto } from './dto/pedido-list-query.dto';
import { PedidoResponseDto } from './dto-responses/pedido-response.dto';

import { JwtAuthGuard } from 'src/shared/guards/jwt/jwt.guard';
import { RolesGuard } from 'src/shared/guards/roles/roles.guard';
import { Roles } from 'src/shared/decorators/roles/roles.decorator';
import { Role } from 'src/shared/enums/roles/role.enum';

@ApiTags('Pedidos')
@ApiBearerAuth('bearer')
@ApiUnauthorizedResponse({ description: 'No autenticado' })
@ApiForbiddenResponse({ description: 'Sin permisos' })
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('pedidos')
export class PedidosController {
  constructor(private readonly pedidosService: PedidosService) {}

  @ApiOperation({
    summary: 'Crear pedido (transaccional)',
    description:
      'Crea un pedido y sus líneas en una sola transacción. Los precios se guardan como snapshot en las líneas.',
  })
  @ApiCreatedResponse({ description: 'Pedido creado', type: PedidoResponseDto })
  @ApiBadRequestResponse({ description: 'Datos inválidos' })
  @Roles(Role.Admin, Role.User)
  @Post()
  @HttpCode(201)
  create(@Body() dto: CreatePedidoDto): Promise<PedidoResponseDto> {
    return this.pedidosService.create(dto);
  }

  @ApiOperation({ summary: 'Listar pedidos', description: 'Filtros, paginación y orden.' })
  @ApiOkResponse({ description: 'Listado de pedidos', type: PedidoResponseDto, isArray: true })
  // Doc de queries 1:1 con PedidoListQueryDto
  @ApiQuery({ name: 'codigo', required: false, description: 'ILIKE en código' })
  @ApiQuery({ name: 'estado', required: false, description: 'Estado exacto (ej: PENDIENTE)' })
  @ApiQuery({ name: 'userId', required: false, description: 'ID del usuario (owner)' })
  @ApiQuery({ name: 'puntoVentaId', required: false, description: 'ID del punto de venta' })
  @ApiQuery({ name: 'status', required: false, type: Boolean, description: 'true/false' })
  @ApiQuery({ name: 'page', required: false, type: Number, description: 'Por defecto 1' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Por defecto 20 (máx 100)' })
  @ApiQuery({
    name: 'sortBy',
    required: false,
    enum: ['createdAt', 'updatedAt', 'codigo', 'estado'],
    description: 'Campo de orden',
  })
  @ApiQuery({
    name: 'order',
    required: false,
    enum: ['ASC', 'DESC'],
    description: 'Dirección de orden',
  })
  @Roles(Role.Admin, Role.User)
  @Get()
  findAll(@Query() q: PedidoListQueryDto): Promise<PedidoResponseDto[]> {
    return this.pedidosService.findAll(q);
  }

  @ApiOperation({ summary: 'Obtener pedido por id (incluye líneas)' })
  @ApiOkResponse({ description: 'Pedido encontrado', type: PedidoResponseDto })
  @ApiNotFoundResponse({ description: 'Pedido no encontrado' })
  @ApiParam({ name: 'id', description: 'ID del pedido', example: 'ped-uuid' })
  @Roles(Role.Admin, Role.User)
  @Get(':id')
  findOne(@Param('id') id: string): Promise<PedidoResponseDto> {
    return this.pedidosService.findOne(id);
  }

  @ApiOperation({
    summary: 'Actualizar pedido',
    description:
      'Actualiza el encabezado; si envías `lineas`, se reemplazan todas en transacción (DELETE + INSERT) recalculando snapshots.',
  })
  @ApiOkResponse({ description: 'Pedido actualizado', type: PedidoResponseDto })
  @ApiNotFoundResponse({ description: 'Pedido no encontrado' })
  @ApiBadRequestResponse({ description: 'Datos inválidos o conflicto' })
  @ApiParam({ name: 'id', description: 'ID del pedido', example: 'ped-uuid' })
  @Roles(Role.Admin, Role.User)
  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdatePedidoDto): Promise<PedidoResponseDto> {
    return this.pedidosService.update(id, dto);
  }

  @ApiOperation({ summary: 'Eliminar pedido' })
  @ApiNoContentResponse({ description: 'Pedido eliminado' })
  @ApiNotFoundResponse({ description: 'Pedido no encontrado' })
  @ApiParam({ name: 'id', description: 'ID del pedido', example: 'ped-uuid' })
  @Roles(Role.Admin)
  @Delete(':id')
  @HttpCode(204)
  remove(@Param('id') id: string): Promise<void> {
    return this.pedidosService.remove(id);
  }
}