import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { Detections } from '../interfaces/detections.interface';

@Entity()
export class DetectionEntity implements Detections {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  cameraName: string;

  @Column('float')
  latitude: number;

  @Column('float')
  longitude: number;

  @Column()
  categoryName: string;

  @Column('datetime')
  timestamp: Date;

  @Column('text')
  frame: string;
}
