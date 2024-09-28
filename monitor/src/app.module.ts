import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { ScheduleModule } from '@nestjs/schedule';
import { Monitor } from './monitor/monitor';
import { ProcessorService } from './services/processor/processor.service';
import { HttpModule } from '@nestjs/axios';
import { CacheService } from './services/cache/cache.service';

@Module({
  imports: [ScheduleModule.forRoot(), HttpModule],
  controllers: [AppController],
  providers: [Monitor, ProcessorService, CacheService],
})
export class AppModule {}
