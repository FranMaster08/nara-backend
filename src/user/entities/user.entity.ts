import {
  Column,
  Entity,
  PrimaryColumn,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Pedido } from '../../pedidos/entities/pedido.entity';
import { OperadorPdv } from '../../operador-pdv/entities/operador-pdv.entity';

@Entity({ name: 'users' })
export class Users {
  @PrimaryColumn('text')
  id: string;

  @Column('text')
  name: string;

  @Column('text')
  lastName: string;

  @Column('text', { name: 'password_hash' })
  passwordHash: string;

  @Column('date', { name: 'birthDate' })
  birthDate: string;

  @Column('text')
  phone: string;

  @Column('text', { unique: true })
  email: string;

  @Column('text')
  address: string;

  @Column('text')
  role: string;

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

  @OneToMany(() => Pedido, (p) => p.user)
  pedidos: Pedido[];

  @OneToMany(() => OperadorPdv, (op) => op.operador)
  asignacionesPdv: OperadorPdv[];
}