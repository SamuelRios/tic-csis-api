import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { ScheduleModule } from '@nestjs/schedule';
import { Monitor } from './monitor/monitor';
import { ProcessorService } from './services/processor/processor.service';
import { HttpModule } from '@nestjs/axios';
import { CacheService } from './services/cache/cache.service';
import { ConfigModule } from '@nestjs/config';
import { DetectionsGateway } from './websockets/detection.gateway';

@Module({
  imports: [
    ConfigModule.forRoot({isGlobal: true}),
    ScheduleModule.forRoot(),
    HttpModule
  ],
  controllers: [AppController],
  providers: [DetectionsGateway, Monitor, ProcessorService, CacheService],
})
export class AppModule {}
