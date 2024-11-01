import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'roles' })
export class RoleEntity {

  @PrimaryGeneratedColumn({ name: 'id' })
  id: number;

  @Column({ name: 'role_name' })
  roleName: string;
  
}
