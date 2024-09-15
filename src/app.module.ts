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
      host: '34.19.59.178',
      port: 3306,
      username: 'root',
      password: 'demoday123',
      database: 'detection_teste',
      entities: [DetectionEntity, CameraEntity, CameraLocationEntity, OperatorEntity, PriorityEntity, StatusEntity],
      synchronize: true,
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
