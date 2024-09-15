import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { CameraEntity } from './camera.entity';

@Entity({ name: 'camera_locations' })
export class CameraLocationEntity {

  @PrimaryGeneratedColumn({ name: 'location_id' })
  locationId: number;

  @ManyToOne(() => CameraEntity)
  @JoinColumn({ name: 'camera_id' })
  camera: CameraEntity;

  @Column('float', { precision: 9, scale: 7 })
  latitude: number;

  @Column('float', { precision: 9, scale: 7 })
  longitude: number;
  
  @Column()
  timestamp: Date;

  @Column({name: 'is_active'})
  isActive: Boolean;

}
