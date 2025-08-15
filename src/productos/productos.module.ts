import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Producto } from './entities/producto.entity';
import { ProductosService } from './productos.service';
import { ProductosController } from './productos.controller';

// productos.module.ts
import { LoggerModule } from 'nestjs-pino';

@Module({
  imports: [
    TypeOrmModule.forFeature([Producto]),
    LoggerModule.forRoot(), // 👈 garantiza el provider del logger
  ],
  controllers: [ProductosController],
  providers: [ProductosService],
  exports: [ProductosService],
})
export class ProductosModule { }