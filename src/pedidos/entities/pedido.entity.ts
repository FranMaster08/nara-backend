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
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { LineaPedido } from './linea-pedido.entity';

@Entity({ name: 'pedidos' })
@Index('pedidos_idx_pedidos_operador', ['user'])
@Index('pedidos_idx_pedidos_pdv', ['puntoVenta'])
@Index('pedidos_idx_pedidos_estado', ['estado'])
@Index('pedidos_idx_pedidos_created_at', ['createdAt'])
export class Pedido {
  @PrimaryGeneratedColumn('uuid')
  id: string;


  @Column('text')
  codigo: string;

  @Column('text', { name: 'user_id' })
  userId: string;

  @ManyToOne(() => Users, (u) => u.pedidos, { eager: false })
  @JoinColumn({ name: 'user_id' })
  user: Users;


  @Column('text', { name: 'punto_venta_id' })
  puntoVentaId: string;


  @ManyToOne(() => PuntoVenta, (pv) => pv.pedidos, { eager: false })
  @JoinColumn({ name: 'punto_venta_id' })
  puntoVenta: PuntoVenta;

  @Column('text')
  estado: string; // si luego defines enum, cámbialo a 'enum'

  @Column('text', { nullable: true })
  notas?: string;

  @Column({ type: 'boolean', default: true })
  status: boolean;
  // ✅ se fija en el momento del INSERT
  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamptz',        // guarda fecha + hora con zona horaria
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;

  // ✅ se actualiza automáticamente en cada UPDATE
  @UpdateDateColumn({
    name: 'updated_at',
    type: 'timestamptz',
    default: () => 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;

  @Column({ name: 'create_by', type: 'text' })
  createBy: string;

  @OneToMany(() => LineaPedido, (lp) => lp.pedido, {
    cascade: ['insert', 'update'],
  })
  lineas: LineaPedido[];
}
