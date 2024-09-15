import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'cameras' })
export class CameraEntity {

  @PrimaryGeneratedColumn({ name: 'camera_id' })
  cameraId: number;

  @Column()
  name: string;
  
  @Column({ name: 'has_gps' })
  hasGps: boolean;

}
