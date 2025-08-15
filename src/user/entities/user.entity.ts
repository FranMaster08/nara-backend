// src/user/entities/user.entity.ts
import { Column, Entity, PrimaryColumn, OneToMany } from 'typeorm';
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
  birthDate: string; // o Date si prefieres

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

  @Column({ name: 'created_at', type: 'text', default: 'NOW' })
  createdAt: string;

  @Column({ name: 'updated_at', type: 'text', default: 'NOW' })
  updatedAt: string;

  @OneToMany(() => Pedido, (p) => p.user)
  pedidos: Pedido[];

  @OneToMany(() => OperadorPdv, (op) => op.operador)
  asignacionesPdv: OperadorPdv[];
}
