import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { RoleEntity } from './role.entity';
import { Exclude } from 'class-transformer';

@Entity({ name: 'users' })
export class UserEntity {

  @PrimaryGeneratedColumn({ name: 'id' })
  id: number;

  @Column({ name: 'name' })
  name: string;

  @Column({ name: 'email' })
  email: string;

  @Exclude()
  @Column({ name: 'password' })
  password: string;

  @ManyToOne(() => RoleEntity)
  @JoinColumn({ name: 'role_id' })
  roleId: RoleEntity;

  @Column({name:"created_at"})
  createdAt: Date;
  
}
