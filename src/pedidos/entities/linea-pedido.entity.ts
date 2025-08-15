import { Column, Entity, PrimaryColumn, ManyToOne, Index } from 'typeorm';
import { Pedido } from './pedido.entity';
import { Producto } from '../../productos/entities/producto.entity';

@Entity({ name: 'lineas_pedido' })
@Index('lineas_pedido_idx_lineas_pedido_pedido', ['pedido'])
export class LineaPedido {
  @PrimaryColumn('text')
  id: string;

  @ManyToOne(() => Pedido, (p) => p.lineas, { onDelete: 'CASCADE' })
  pedido: Pedido;

  @ManyToOne(() => Producto, (prod) => prod.lineas, { eager: true })
  producto: Producto;

  @Column('int')
  cantidad: number;

  @Column('numeric', { nullable: true })
  precio_unitario_snapshot?: string;

  @Column('numeric', { nullable: true })
  subtotal_snapshot?: string;
}
