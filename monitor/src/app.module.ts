import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ScheduleModule } from '@nestjs/schedule';
import { FolderMonitorService } from './folder-monitor/folder-monitor.service';
import { FileProcessorService } from './file-processor/file-processor.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [ScheduleModule.forRoot(), HttpModule],
  controllers: [AppController],
  providers: [AppService, FolderMonitorService, FileProcessorService],
})
export class AppModule {}
