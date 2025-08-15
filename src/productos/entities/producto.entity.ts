// src/productos/entities/producto.entity.ts
import { Column, Entity, PrimaryColumn, OneToMany, Index } from 'typeorm';
import { LineaPedido } from '../../pedidos/entities/linea-pedido.entity';

@Entity({ name: 'productos' })
export class Producto {
  @PrimaryColumn('text')
  id: string;

  @Column('text')
  nombre: string;

  @Column('numeric')
  precio_unitario: string; // usar string para numeric

  @Index({ unique: true })
  @Column('text', { nullable: true })
  sku?: string;

  @Column({ type: 'boolean', default: true })
  status: boolean;

  @Column({ name: 'created_at', type: 'text', default: 'NOW' })
  createdAt: string;

  @Column({ name: 'updated_at', type: 'text', default: 'NOW' })
  updatedAt: string;

  @OneToMany(() => LineaPedido, (lp) => lp.producto)
  lineas: LineaPedido[];
}
