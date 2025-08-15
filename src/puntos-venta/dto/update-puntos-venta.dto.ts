import { PartialType } from '@nestjs/swagger';
import { CreatePuntosVentaDto } from './create-puntos-venta.dto';

export class UpdatePuntosVentaDto extends PartialType(CreatePuntosVentaDto) {}
