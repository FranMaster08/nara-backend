import { Module } from '@nestjs/common';
import { PedidosService } from './pedidos.service';
import { PedidosController } from './pedidos.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LoggerModule } from 'nestjs-pino';
import { Pedido } from './entities/pedido.entity';
import { LineaPedido } from './entities/linea-pedido.entity';
import { Producto } from 'src/productos/entities/producto.entity';


@Module({
  imports: [
    TypeOrmModule.forFeature([Pedido, LineaPedido, Producto]),
    LoggerModule.forRoot(), // 👈 garantiza el provider del logger
  ],
  controllers: [PedidosController],
  providers: [PedidosService],
})
export class PedidosModule { }
