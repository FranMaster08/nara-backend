// src/operador-pdv/operador-pdv.controller.ts
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

import { OperadorPdvService } from './operador-pdv.service';
import { CreateOperadorPdvDto } from './dto/create-operador-pdv.dto';
import { UpdateOperadorPdvDto } from './dto/update-operador-pdv.dto';

@ApiTags('Operador-PDV')
@ApiBearerAuth('bearer')
@Controller('operador-pdv')
export class OperadorPdvController {
  constructor(private readonly operadorPdvService: OperadorPdvService) { }

  @ApiOperation({ summary: 'Crear relación operador-punto de venta' })
  @Post()
  create(@Body() dto: CreateOperadorPdvDto) {
    return this.operadorPdvService.create(dto);
  }

  @ApiOperation({ summary: 'Listar todas las relaciones operador-pdv' })
  @Get()
  findAll() {
    return this.operadorPdvService.findAll();
  }

  @ApiOperation({ summary: 'Obtener una relación por operadorId y puntoVentaId' })
  @Get(':operadorId/:puntoVentaId')
  findOne(
    @Param('operadorId') operadorId: string,
    @Param('puntoVentaId') puntoVentaId: string,
  ) {
    return this.operadorPdvService.findOne(operadorId, puntoVentaId);
  }

  @ApiOperation({ summary: 'Actualizar relación operador-pdv' })
  @Patch(':operadorId/:puntoVentaId')
  update(
    @Param('operadorId') operadorId: string,
    @Param('puntoVentaId') puntoVentaId: string,
    @Body() dto: UpdateOperadorPdvDto,
  ) {
    return this.operadorPdvService.update(operadorId, puntoVentaId, dto);
  }

  @ApiOperation({ summary: 'Eliminar relación operador-pdv' })
  @Delete(':operadorId/:puntoVentaId')
  remove(
    @Param('operadorId') operadorId: string,
    @Param('puntoVentaId') puntoVentaId: string,
  ) {
    return this.operadorPdvService.remove(operadorId, puntoVentaId);
  }
}