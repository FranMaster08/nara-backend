// src/operador-pdv/entities/operador-pdv.entity.ts
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryColumn, UpdateDateColumn } from 'typeorm';
import { Users } from '../../user/entities/user.entity';
import { PuntoVenta } from 'src/puntos-venta/entities/puntos-venta.entity';

@Entity({ name: 'operador_pdv' })
export class OperadorPdv {
  @PrimaryColumn('text', { name: 'operador_id' })
  operadorId: string;

  @PrimaryColumn('text', { name: 'punto_venta_id' })
  puntoVentaId: string;

  @ManyToOne(() => Users, (u) => u.asignacionesPdv, { onDelete: 'CASCADE' })
  operador: Users;

  @ManyToOne(() => PuntoVenta, (pv) => pv.operadoresAsignados, {
    onDelete: 'CASCADE',
  })
  puntoVenta: PuntoVenta;

  @Column({ name: 'assigned_at', type: 'text', default: 'NOW' })
  assignedAt: string;

  @Column({ type: 'boolean' })
  enabled: boolean;

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
}
