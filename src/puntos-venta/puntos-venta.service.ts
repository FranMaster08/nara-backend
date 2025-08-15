import { Injectable } from '@nestjs/common';
import { CreatePuntosVentaDto } from './dto/create-puntos-venta.dto';
import { UpdatePuntosVentaDto } from './dto/update-puntos-venta.dto';

@Injectable()
export class PuntosVentaService {
  create(createPuntosVentaDto: CreatePuntosVentaDto) {
    return 'This action adds a new puntosVenta';
  }

  findAll() {
    return `This action returns all puntosVenta`;
  }

  findOne(id: number) {
    return `This action returns a #${id} puntosVenta`;
  }

  update(id: number, updatePuntosVentaDto: UpdatePuntosVentaDto) {
    return `This action updates a #${id} puntosVenta`;
  }

  remove(id: number) {
    return `This action removes a #${id} puntosVenta`;
  }
}
