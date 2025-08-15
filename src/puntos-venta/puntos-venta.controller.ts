import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PuntosVentaService } from './puntos-venta.service';
import { CreatePuntosVentaDto } from './dto/create-puntos-venta.dto';
import { UpdatePuntosVentaDto } from './dto/update-puntos-venta.dto';

@Controller('puntos-venta')
export class PuntosVentaController {
  constructor(private readonly puntosVentaService: PuntosVentaService) {}

  @Post()
  create(@Body() createPuntosVentaDto: CreatePuntosVentaDto) {
    return this.puntosVentaService.create(createPuntosVentaDto);
  }

  @Get()
  findAll() {
    return this.puntosVentaService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.puntosVentaService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePuntosVentaDto: UpdatePuntosVentaDto) {
    return this.puntosVentaService.update(+id, updatePuntosVentaDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.puntosVentaService.remove(+id);
  }
}
