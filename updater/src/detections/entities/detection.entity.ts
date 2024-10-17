import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { CameraEntity } from './camera.entity';
import { CameraLocationEntity } from './cameraLocation.entity';
import { UserEntity } from './user.entity';
import { StatusEntity } from './status.entity';
import { PriorityEntity } from './priority.entity';

@Entity({ name: 'detections' })
export class DetectionEntity {
  @PrimaryGeneratedColumn({ name: 'detection_id' })
  id: number;
   
  @Column()
  category: string;

  @ManyToOne(() => CameraEntity)
  @JoinColumn({ name: 'camera_id' })
  camera: CameraEntity;

  @ManyToOne(() => CameraLocationEntity)
  @JoinColumn({ name: 'location_id' })
  location: CameraLocationEntity;

  @ManyToOne(() => StatusEntity)
  @JoinColumn({ name: 'status_id' })
  status: StatusEntity;

  @ManyToOne(() => PriorityEntity)
  @JoinColumn({ name: 'priority_id' })
  priority: PriorityEntity;

  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: 'assigned_to' })
  assignedTo: UserEntity;

  @Column({ name: 'detection_frame_url' })
  framePath: string;

  @Column({ type: 'text' })
  notes: string;

  @Column({ name: 'timestamp' })
  timestamp: Date;
}
