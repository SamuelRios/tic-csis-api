import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DetectionEntity } from './entities/detection.entity';
import { DetectionsController } from './detections.controller';
import { DetectionsService } from './services/detections.service';
import { CameraService } from './services/camera.service';
import { CameraLocationService } from './services/cameraLocation.service';
import { CameraEntity } from './entities/camera.entity';
import { CameraLocationEntity } from './entities/cameraLocation.entity';
import { PriorityEntity } from './entities/priority.entity';
import { StatusEntity } from './entities/status.entity';
import { PriorityService } from './services/priority.service';
import { StatusService } from './services/status.service';
import { HttpModule } from '@nestjs/axios';
import { DetectionGateway } from './websockets/detection/detection.gateway';
import { DetectionChangesEntity } from './entities/detectionChangesHistory.entity';
import { DetectionNoteEntity } from './entities/detectionNote.entity';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [
    TypeOrmModule.forFeature(
      [
        DetectionEntity,
        CameraEntity,
        CameraLocationEntity,
        PriorityEntity,
        StatusEntity,
        DetectionChangesEntity,
        DetectionNoteEntity,
      ]
    ),
    HttpModule,
    UsersModule
  ],
  controllers: [DetectionsController],
  providers: [
    DetectionsService,
    CameraService,
    CameraLocationService,
    PriorityService,
    StatusService,
    DetectionGateway
  ],
})
export class DetectionsModule {}
