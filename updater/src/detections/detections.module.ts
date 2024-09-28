import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DetectionEntity } from './entities/detection.entity';
import { DetectionsController } from './detections.controller';
import { DetectionsService } from './services/detections.service';
import { CameraService } from './services/camera.service';
import { CameraLocationService } from './services/cameraLocation.service';
import { CameraEntity } from './entities/camera.entity';
import { CameraLocationEntity } from './entities/cameraLocation.entity';
import { UserEntity } from './entities/user.entity';
import { PriorityEntity } from './entities/priority.entity';
import { StatusEntity } from './entities/status.entity';
import { PriorityService } from './services/priority.service';
import { StatusService } from './services/status.service';
import { UserService } from './services/user.service';
import { HttpModule } from '@nestjs/axios';
import { DetectionGateway } from './gateways/detection/detection.gateway';

@Module({
  imports: [
    TypeOrmModule.forFeature(
      [
        DetectionEntity,
        CameraEntity,
        CameraLocationEntity,
        UserEntity,
        PriorityEntity,
        StatusEntity
      ]
    ),
    HttpModule,
  ],
  controllers: [DetectionsController],
  providers: [
    DetectionsService,
    CameraService,
    CameraLocationService,
    PriorityService,
    StatusService,
    UserService,
    DetectionGateway
  ],
})
export class DetectionsModule {}
