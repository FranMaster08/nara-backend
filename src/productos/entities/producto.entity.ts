// src/productos/entities/producto.entity.ts
import { Column, Entity, PrimaryColumn, OneToMany, Index, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { LineaPedido } from '../../pedidos/entities/linea-pedido.entity';

@Entity({ name: 'productos' })
export class Producto {
  @PrimaryGeneratedColumn('uuid')
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
  
  @OneToMany(() => LineaPedido, (lp) => lp.producto)
  lineas: LineaPedido[];
}
