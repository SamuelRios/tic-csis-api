import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { DetectionEntity } from './detection.entity';
import { UserEntity } from './user.entity';

@Entity({ name: 'detection_notes' })
export class DetectionNoteEntity {

  @PrimaryGeneratedColumn({ name: 'id' })
  id: number;

  @ManyToOne(() => DetectionEntity)
  @JoinColumn({ name: 'detection_id' })
  detection: DetectionEntity;

  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;

  @Column({ type: 'text' })
  note: string;

  @Column({ name: 'created_at' })
  createdAt: Date;
  
}
