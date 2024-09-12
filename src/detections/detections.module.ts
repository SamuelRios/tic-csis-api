import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DetectionEntity } from './entities/detections.entity';
import { DetectionsController } from './detections.controller';
import { DetectionsService } from './detections.service';

@Module({imports: [TypeOrmModule.forFeature([DetectionEntity])], // Aqui você registra a entidade
  controllers: [DetectionsController],
  providers: [DetectionsService]
})
export class DetectionsModule {

    
}
