import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity("detections")
export class DetectionEntity {
  @PrimaryGeneratedColumn()
  detection_id: number;

  @Column("camera_id")
  cameraId: number;

  @Column("location_id")
  locationId: number;

  @Column()
  categoryNumber: string;

  @Column('datetime')
  timestamp: Date;

  @Column('text')
  frame: string;
}
