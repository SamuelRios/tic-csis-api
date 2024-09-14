  import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class DetectionEntity {
  @PrimaryGeneratedColumn({ name: 'detection_id' })
  detectionId: number;

  @Column({ name: 'camera_id' })
  cameraId: number;

  @Column({ name: 'location_id' })
  locationId: string;
  
  @Column()
  category: string;

  @Column({ name: 'frame_path' })
  framePath: string;

  @Column({ name: 'status_id' })
  statusId: number;

  @Column({ name: 'priority_id' })
  priorityId: number;

  @Column()
  timestamp: Date;
}
