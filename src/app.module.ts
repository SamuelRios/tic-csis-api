import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DetectionsModule } from './detections/detections.module';
import { DetectionEntity } from './detections/entities/detection.entity';
import { CameraEntity } from './detections/entities/camera.entity';
import { CameraLocationEntity } from './detections/entities/cameraLocation.entity';
import { OperatorEntity } from './detections/entities/operator.entity';
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
      password: '',
      database: 'detection_system',
      entities: [DetectionEntity, CameraEntity, CameraLocationEntity, OperatorEntity, PriorityEntity, StatusEntity],
      synchronize: false,
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
