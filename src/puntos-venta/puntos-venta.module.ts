// src/puntos-venta/puntos-venta.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { PuntoVenta } from './entities/puntos-venta.entity';
import { PuntosVentaService } from './puntos-venta.service';
import { PuntosVentaController } from './puntos-venta.controller';

@Module({
  imports: [TypeOrmModule.forFeature([PuntoVenta])],
  controllers: [PuntosVentaController],
  providers: [PuntosVentaService],
  exports: [PuntosVentaService, TypeOrmModule], // opcional, por si otros módulos lo usan
})
export class PuntosVentaModule {}