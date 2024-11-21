import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DetectionsModule } from './detections/detections.module';
import { DetectionEntity } from './detections/entities/detection.entity';
import { CameraEntity } from './detections/entities/camera.entity';
import { CameraLocationEntity } from './detections/entities/cameraLocation.entity';
import { UserEntity } from './users/entities/user.entity';
import { PriorityEntity } from './detections/entities/priority.entity';
import { StatusEntity } from './detections/entities/status.entity';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { DetectionChangesEntity } from './detections/entities/detectionChangesHistory.entity';
import { DetectionNoteEntity } from './detections/entities/detectionNote.entity';
import { RoleEntity } from './users/entities/role.entity';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // Isso garante que o ConfigModule será acessível em todo o projeto
    }),
    DetectionsModule,
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get<string>('DB_HOST'),
        port: configService.get<number>('DB_PORT'),
        username: configService.get<string>('DB_USERNAME'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_DATABASE'),
        entities: [
          DetectionEntity,
          CameraEntity,
          CameraLocationEntity,
          UserEntity,
          PriorityEntity,
          StatusEntity,
          DetectionChangesEntity,
          DetectionNoteEntity,
          RoleEntity
        ],
        synchronize: true,
      }),
    }),
    UsersModule,
    AuthModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
