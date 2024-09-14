import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DetectionsModule } from './detections/detections.module';
import { DetectionEntity } from './detections/entities/detections.entity';


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
      entities: [DetectionEntity],
      synchronize: true,    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
