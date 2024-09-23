import { Entity, Column, ManyToOne, JoinColumn, PrimaryColumn } from 'typeorm';
import { CameraEntity } from './camera.entity';

@Entity({ name: 'camera_locations' })
export class CameraLocationEntity {

  @PrimaryColumn({ name: 'location_id' })
  locationId: string;

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
