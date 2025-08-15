import { Column, Entity, PrimaryColumn, OneToMany } from 'typeorm';
import { Pedido } from '../../pedidos/entities/pedido.entity';
import { OperadorPdv } from '../../operador-pdv/entities/operador-pdv.entity';

@Entity({ name: 'puntos_de_venta' })
export class PuntoVenta {
  @PrimaryColumn('text')
  id: string;

  @Column('text')
  name: string;

  @Column('text')
  address: string;

  @Column('text')
  phone: string;

  @Column('text')
  lat: string;

  @Column('text')
  lng: string;

  @Column({ type: 'boolean', default: true })
  status: boolean;

  @Column({ name: 'created_at', type: 'text', default: 'NOW' })
  createdAt: string;

  @Column({ name: 'updated_at', type: 'text', default: 'NOW' })
  updatedAt: string;

  @OneToMany(() => Pedido, (p) => p.puntoVenta)
  pedidos: Pedido[];

  @OneToMany(() => OperadorPdv, (op) => op.puntoVenta)
  operadoresAsignados: OperadorPdv[];
}
