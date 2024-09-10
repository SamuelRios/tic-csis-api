import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DetectionsModule } from './detections/detections.module';
import { DetectionsControllerController } from './detections/detections-controller.controller';

@Module({
  imports: [DetectionsModule],
  controllers: [AppController, DetectionsControllerController],
  providers: [AppService],
})
export class AppModule {}
