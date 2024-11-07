import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CameraEntity } from '../entities/camera.entity';

@Injectable()
export class CameraService {
  constructor(
    @InjectRepository(CameraEntity)
    private cameraRepository: Repository<CameraEntity>,
  ) {}

  async findByName(cameraName: string): Promise<CameraEntity | undefined> {
    return this.cameraRepository.findOne({ where: { name: cameraName } });
  }

  async create(cameraData: Partial<CameraEntity>): Promise<CameraEntity> {
    const newCamera = this.cameraRepository.create(cameraData);
    return this.cameraRepository.save(newCamera);
  }
}
