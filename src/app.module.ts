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
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: '',
      database: 'detection_teste',
      entities: [DetectionEntity],
      synchronize: true,    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
