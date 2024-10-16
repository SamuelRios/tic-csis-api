import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'priorities' })
export class PriorityEntity {

  @PrimaryGeneratedColumn({ name: 'id' })
  priorityId: number;

  @Column({ name: 'priority_name' })
  priorityName: string;
  
}
