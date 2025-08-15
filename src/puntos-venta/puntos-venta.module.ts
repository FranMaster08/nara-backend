import { Module } from '@nestjs/common';
import { PuntosVentaService } from './puntos-venta.service';
import { PuntosVentaController } from './puntos-venta.controller';

@Module({
  controllers: [PuntosVentaController],
  providers: [PuntosVentaService],
})
export class PuntosVentaModule {}
