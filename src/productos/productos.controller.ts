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

import { ProductosService } from './productos.service';
import { CreateProductoDto } from './dto/create-producto.dto';
import { UpdateProductoDto } from './dto/update-producto.dto';
import { ProductoResponseDto } from './dto-responses/producto-response.dto';
import { ProductoListQueryDto } from './dto/producto-list-query.dto';

import { JwtAuthGuard } from 'src/shared/guards/jwt/jwt.guard';
import { RolesGuard } from 'src/shared/guards/roles/roles.guard';
import { Roles } from 'src/shared/decorators/roles/roles.decorator';
import { Role } from 'src/shared/enums/roles/role.enum';

@ApiTags('Productos')
@ApiBearerAuth('bearer')
@ApiUnauthorizedResponse({ description: 'No autenticado' })
@ApiForbiddenResponse({ description: 'Sin permisos' })
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('productos')
export class ProductosController {
  constructor(private readonly service: ProductosService) { }

  @ApiOperation({
    summary: 'Crear producto',
    description:
      'Crea un producto. Si se desea insertar múltiples productos, usar el endpoint /bulk.',
  })
  @ApiCreatedResponse({
    description: 'Producto creado',
    type: ProductoResponseDto,
  })
  @ApiBadRequestResponse({ description: 'Datos inválidos' })
  @Roles(Role.Admin)
  @Post()
  @HttpCode(201)
  async create(@Body() dto: CreateProductoDto): Promise<ProductoResponseDto> {
    return this.service.create(dto);
  }

  @ApiOperation({
    summary: 'Crear productos en lote (transaccional)',
    description:
      'Inserta múltiples productos en una sola transacción. Si alguno falla, se revierte todo.',
  })
  @ApiCreatedResponse({
    description: 'Productos creados',
    type: ProductoResponseDto,
    isArray: true,
  })
  @ApiBadRequestResponse({ description: 'Datos inválidos' })
  @Roles(Role.Admin)
  @Post('bulk')
  @HttpCode(201)
  async createMany(@Body() dtos: CreateProductoDto[]): Promise<ProductoResponseDto[]> {
    return this.service.createMany(dtos);
  }

  @ApiOperation({
    summary: 'Listar productos',
    description: 'Soporta filtros, paginación y orden.',
  })
  @ApiOkResponse({
    description: 'Listado de productos',
    type: ProductoResponseDto,
    isArray: true,
  })
  @ApiQuery({ name: 'nombre', required: false, description: 'ILIKE nombre' })
  @ApiQuery({ name: 'sku', required: false, description: 'ILIKE SKU' })
  @ApiQuery({ name: 'status', required: false, type: Boolean })
  @ApiQuery({ name: 'precioMin', required: false, description: 'decimal string' })
  @ApiQuery({ name: 'precioMax', required: false, description: 'decimal string' })
  @ApiQuery({ name: 'page', required: false, type: Number, description: 'Por defecto 1' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Por defecto 20 (máx 100)' })
  @ApiQuery({
    name: 'sortBy',
    required: false,
    enum: ['nombre', 'precio_unitario', 'createdAt', 'updatedAt', 'sku'],
  })
  @ApiQuery({ name: 'order', required: false, enum: ['ASC', 'DESC'] })
  @Roles(Role.Admin, Role.User)
  @Get()
  async findAll(@Query() q: ProductoListQueryDto): Promise<ProductoResponseDto[]> {
    return this.service.findAll(q);
  }

  @ApiOperation({ summary: 'Obtener producto por id' })
  @ApiOkResponse({ description: 'Producto encontrado', type: ProductoResponseDto })
  @ApiNotFoundResponse({ description: 'Producto no encontrado' })
  @Roles(Role.Admin, Role.User)
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<ProductoResponseDto> {
    return this.service.findOne(id);
  }

  @ApiOperation({ summary: 'Actualizar producto por id' })
  @ApiOkResponse({ description: 'Producto actualizado', type: ProductoResponseDto })
  @ApiNotFoundResponse({ description: 'Producto no encontrado' })
  @ApiBadRequestResponse({ description: 'Datos inválidos o conflicto' })
  @Roles(Role.Admin)
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateProductoDto,
  ): Promise<ProductoResponseDto> {
    return this.service.update(id, dto);
  }

  @ApiOperation({ summary: 'Eliminar producto por id' })
  @ApiNoContentResponse({ description: 'Producto eliminado' })
  @ApiNotFoundResponse({ description: 'Producto no encontrado' })
  @Roles(Role.Admin)
  @Delete(':id')
  @HttpCode(204)
  async remove(@Param('id') id: string): Promise<void> {
    await this.service.remove(id);
  }
}