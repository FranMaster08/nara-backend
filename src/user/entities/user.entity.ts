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

  @Column({ default: true })
  isActive: boolean;
}
