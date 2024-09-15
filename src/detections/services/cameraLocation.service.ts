import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CameraLocationEntity } from '../entities/cameraLocation.entity';

@Injectable()
export class CameraLocationService {
  constructor(
    @InjectRepository(CameraLocationEntity)
    private cameraLocationRepository: Repository<CameraLocationEntity>,
  ) {}

  async findActiveByCameraId(cameraId: number): Promise<CameraLocationEntity | null> {
    return await this.cameraLocationRepository.findOne({
      where: { camera: { cameraId }, isActive: true },
    });
  }


  async create(cameraLocationData: Partial<CameraLocationEntity>): Promise<CameraLocationEntity> {
    const newCameraLocation = this.cameraLocationRepository.create(cameraLocationData);
    return this.cameraLocationRepository.save(newCameraLocation);
  }

  async update(cameraLocationId: number, updateData: Partial<CameraLocationEntity>): Promise<void> {
    await this.cameraLocationRepository.update(cameraLocationId, updateData);
  }
}
