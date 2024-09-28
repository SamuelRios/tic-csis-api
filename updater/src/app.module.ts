import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DetectionsModule } from './detections/detections.module';
import { DetectionEntity } from './detections/entities/detection.entity';
import { CameraEntity } from './detections/entities/camera.entity';
import { CameraLocationEntity } from './detections/entities/cameraLocation.entity';
import { UserEntity } from './detections/entities/user.entity';
import { PriorityEntity } from './detections/entities/priority.entity';
import { StatusEntity } from './detections/entities/status.entity';

@Module({
  imports: [
    DetectionsModule,
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'dbadmin01',
      database: 'detection_test',
      entities: [DetectionEntity, CameraEntity, CameraLocationEntity, UserEntity, PriorityEntity, StatusEntity],
      synchronize: true,
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
