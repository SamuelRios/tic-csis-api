import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'operators' })
export class OperatorEntity {

  @PrimaryGeneratedColumn({ name: 'operator_id' })
  operatorId: number;

  @Column({ name: 'operator_name' })
  operatorName: string;
  
}
