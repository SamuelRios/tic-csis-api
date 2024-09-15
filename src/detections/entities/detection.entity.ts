import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { CameraEntity } from './camera.entity';
import { CameraLocationEntity } from './cameraLocation.entity';
import { OperatorEntity } from './operator.entity';
import { StatusEntity } from './status.entity';
import { PriorityEntity } from './priority.entity';

@Entity({ name: 'detections' })
export class DetectionEntity {
  @PrimaryGeneratedColumn({ name: 'detection_id' })
  detectionId: number;

  @ManyToOne(() => CameraEntity)
  @JoinColumn({ name: 'camera_id' })
  camera: CameraEntity;

  @ManyToOne(() => CameraLocationEntity)
  @JoinColumn({ name: 'location_id' })
  location: CameraLocationEntity;

  @Column()
  category: string;

  @Column({ name: 'frame_path' })
  framePath: string;
  
  @ManyToOne(() => OperatorEntity)
  @JoinColumn({ name: 'operator_id' })
  operator: OperatorEntity;

  @ManyToOne(() => PriorityEntity)
  @JoinColumn({ name: 'priority_id' })
  priority: PriorityEntity;
  
  @ManyToOne(() => StatusEntity)
  @JoinColumn({ name: 'status_id' })
  status: StatusEntity;

  @Column()
  timestamp: Date;
}
