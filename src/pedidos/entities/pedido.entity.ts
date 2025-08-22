// src/pedidos/entities/pedido.entity.ts
import { PuntoVenta } from 'src/puntos-venta/entities/puntos-venta.entity';
import { Users } from 'src/user/entities/user.entity';
import {
  Column,
  Entity,
  PrimaryColumn,
  ManyToOne,
  OneToMany,
  Index,
  JoinColumn,
} from 'typeorm';
import { LineaPedido } from './linea-pedido.entity';

@Entity({ name: 'pedidos' })
@Index('pedidos_idx_pedidos_operador', ['user'])
@Index('pedidos_idx_pedidos_pdv', ['puntoVenta'])
@Index('pedidos_idx_pedidos_estado', ['estado'])
@Index('pedidos_idx_pedidos_created_at', ['createdAt'])
export class Pedido {
  @PrimaryColumn('text')
  id: string;

  @Column('text')
  codigo: string;

  @Column('text', { name: 'user_id' })
  userId: string;

  @ManyToOne(() => Users, (u) => u.pedidos, { eager: false })
  @JoinColumn({ name: 'user_id' })
  user: Users;

  @ManyToOne(() => PuntoVenta, (pv) => pv.pedidos, { eager: false })
  puntoVenta: PuntoVenta;

  @Column('text')
  estado: string; // si luego defines enum, cámbialo a 'enum'

  @Column('text', { nullable: true })
  notas?: string;

  @Column({ type: 'boolean', default: true })
  status: boolean;

  @Column({ name: 'created_at', type: 'text', default: 'NOW' })
  createdAt: string;

  @Column({ name: 'updated_at', type: 'text', default: 'NOW' })
  updatedAt: string;

  @Column({ name: 'create_by', type: 'text' })
  createBy: string;

  @OneToMany(() => LineaPedido, (lp) => lp.pedido, {
    cascade: ['insert', 'update'],
  })
  lineas: LineaPedido[];
}
