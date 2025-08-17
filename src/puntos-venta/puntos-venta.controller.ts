// src/puntos-venta/puntos-venta.controller.ts
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
  ApiQuery,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

import { PuntosVentaService } from './puntos-venta.service';
import { CreatePuntosVentaDto } from './dto/create-puntos-venta.dto';
import { UpdatePuntosVentaDto } from './dto/update-puntos-venta.dto';
import { PuntosVentaListQueryDto } from './dto/puntos-venta-list-query.dto';
import { PuntosVentaResponseDto } from './dto-responses/puntos-venta-response.dto';

import { JwtAuthGuard } from 'src/shared/guards/jwt/jwt.guard';
import { RolesGuard } from 'src/shared/guards/roles/roles.guard';
import { Roles } from 'src/shared/decorators/roles/roles.decorator';
import { Role } from 'src/shared/enums/roles/role.enum';

@ApiTags('Puntos de Venta')
@ApiBearerAuth('bearer')
@ApiUnauthorizedResponse({ description: 'No autenticado' })
@ApiForbiddenResponse({ description: 'Sin permisos' })
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('puntos-venta')
export class PuntosVentaController {
  constructor(private readonly service: PuntosVentaService) { }

  @ApiOperation({ summary: 'Crear punto de venta' })
  @ApiCreatedResponse({ description: 'PV creado', type: PuntosVentaResponseDto })
  @ApiBadRequestResponse({ description: 'Datos inválidos' })
  @Roles(Role.Admin)
  @Post()
  @HttpCode(201)
  create(@Body() dto: CreatePuntosVentaDto): Promise<PuntosVentaResponseDto> {
    return this.service.create(dto);
  }

  @ApiOperation({ summary: 'Listar puntos de venta', description: 'Filtros, paginación y orden.' })
  @ApiOkResponse({ description: 'Listado de PV', type: PuntosVentaResponseDto, isArray: true })
  @ApiQuery({ name: 'name', required: false, description: 'ILIKE nombre' })
  @ApiQuery({ name: 'address', required: false, description: 'ILIKE dirección' })
  @ApiQuery({ name: 'phone', required: false, description: 'ILIKE teléfono' })
  @ApiQuery({ name: 'status', required: false, type: Boolean })
  @ApiQuery({ name: 'page', required: false, type: Number, description: 'Por defecto 1' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Por defecto 20 (máx 100)' })
  @ApiQuery({ name: 'sortBy', required: false, enum: ['createdAt', 'updatedAt', 'name', 'address', 'status'] })
  @ApiQuery({ name: 'order', required: false, enum: ['ASC', 'DESC'] })
  @Roles(Role.Admin, Role.User)
  @Get()
  findAll(@Query() q: PuntosVentaListQueryDto): Promise<PuntosVentaResponseDto[]> {
    return this.service.findAll(q);
  }

  @ApiOperation({ summary: 'Obtener punto de venta por id' })
  @ApiOkResponse({ description: 'PV encontrado', type: PuntosVentaResponseDto })
  @ApiNotFoundResponse({ description: 'PV no encontrado' })
  @Roles(Role.Admin, Role.User)
  @Get(':id')
  findOne(@Param('id') id: string): Promise<PuntosVentaResponseDto> {
    return this.service.findOne(id);
  }

  @ApiOperation({ summary: 'Actualizar punto de venta' })
  @ApiOkResponse({ description: 'PV actualizado', type: PuntosVentaResponseDto })
  @ApiNotFoundResponse({ description: 'PV no encontrado' })
  @ApiBadRequestResponse({ description: 'Datos inválidos o conflicto' })
  @Roles(Role.Admin)
  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdatePuntosVentaDto): Promise<PuntosVentaResponseDto> {
    return this.service.update(id, dto);
  }

  @ApiOperation({ summary: 'Eliminar punto de venta' })
  @ApiNoContentResponse({ description: 'PV eliminado' })
  @ApiNotFoundResponse({ description: 'PV no encontrado' })
  @Roles(Role.Admin)
  @Delete(':id')
  @HttpCode(204)
  remove(@Param('id') id: string): Promise<void> {
    return this.service.remove(id);
  }
}