import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'statuses' })
export class StatusEntity {

  @PrimaryGeneratedColumn({ name: 'id' })
  statusId: number;

  @Column({ name: 'status_name' })
  statusName: string;
  
}
