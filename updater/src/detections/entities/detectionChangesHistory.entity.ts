import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    ManyToOne,
    JoinColumn,
  } from 'typeorm';
  import { UserEntity } from './user.entity';
  import { StatusEntity } from './status.entity';
  import { PriorityEntity } from './priority.entity';
import { DetectionEntity } from './detection.entity';
  
  @Entity({ name: 'detection_changes_history' })
  export class DetectionChangesEntity {
    @PrimaryGeneratedColumn({ name: 'id' })
    id: number;
  
    @ManyToOne(() => DetectionEntity)
    @JoinColumn({ name: 'detection_id' })
    detection: DetectionEntity;

    @ManyToOne(() => UserEntity)
    @JoinColumn({ name: 'changed_By' })
    changedBy: UserEntity;
  
    @ManyToOne(() => StatusEntity)
    @JoinColumn({ name: 'previous_status_id' })
    previousStatus: StatusEntity;

    @ManyToOne(() => StatusEntity)
    @JoinColumn({ name: 'new_status_id' })
    newStatus: StatusEntity;
  
    @ManyToOne(() => PriorityEntity)
    @JoinColumn({ name: 'previous_priority_id' })
    previousPriority: PriorityEntity;

    @ManyToOne(() => PriorityEntity)
    @JoinColumn({ name: 'new_priority_id' })
    newPriority: PriorityEntity;

    @ManyToOne(() => UserEntity)
    @JoinColumn({ name: 'previous_assigned_to' })
    previousAssignedTo: UserEntity;

    @ManyToOne(() => UserEntity)
    @JoinColumn({ name: 'new_assigned_to' })
    newAssignedTo: UserEntity;
  
    @Column({ name: 'changed_at' })
    changedAt: Date;
  }
  