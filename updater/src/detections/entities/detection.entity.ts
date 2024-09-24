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
  
  @ManyToOne(() => StatusEntity)
  @JoinColumn({ name: 'status_id' })
  status: StatusEntity;

  

  @ManyToOne(() => PriorityEntity)
  @JoinColumn({ name: 'priority_id' })
  priority: PriorityEntity;
  
  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;

  @Column()
  timestamp: Date;
}
