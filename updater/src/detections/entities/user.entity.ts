import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { Role } from '../enums/role.enum';

@Entity({ name: 'users' })
export class UserEntity {

  @PrimaryGeneratedColumn({ name: 'user_id' })
  userId: number;

  @Column({ name: 'user_name' })
  userName: string;

  @Column({
    type: 'enum',
    enum: Role,
    default: Role.OPERADOR,
  })
  role: Role;
  
}
