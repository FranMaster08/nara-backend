import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Users {

  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  name: string;

  @Column({ unique: true })
  email: string;

  @Column({ nullable: true })
  age?: number;

  @Column({ length: 50 })
  role: string;

  @Column()
  documenTypeId: number;


  @Column({ length: 20 })
  documenNumber: string;


  @Column({ length: 14 })
  cellphone: string;

  @Column({ length: 100 })
  address: string;

  @Column({ default: true })
  create_at: boolean;

  @Column({ default: true })
  update_at: boolean;

  @Column({ default: true })
  isActive: boolean;

}
