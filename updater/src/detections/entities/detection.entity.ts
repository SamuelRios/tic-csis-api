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
  @PrimaryGeneratedColumn({ name: 'id' })
  id: number;

  @ManyToOne(() => CameraEntity)
  @JoinColumn({ name: 'camera_id' })
  camera: CameraEntity;

  @ManyToOne(() => StatusEntity)
  @JoinColumn({ name: 'status_id' })
  status: StatusEntity;

  @ManyToOne(() => PriorityEntity)
  @JoinColumn({ name: 'priority_id' })
  priority: PriorityEntity;

  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: 'assigned_to' })
  signedTo: UserEntity;

  @Column({ name: 'detection_frame_url' })
  framePath: string;

  @Column({ type: 'text' })
  notes: string;

  @Column({ name: 'created_at' })
  createdAt: Date;

  @Column({ name: 'updated_at' })
  updatedAt: Date;

  @Column()
  category: string;

}
