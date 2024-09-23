import { Test, TestingModule } from '@nestjs/testing';
import { CameraLocationEntity } from '../entities/cameraLocation.entity';

describe('CameraLocationEntity', () => {
  let service: CameraLocationEntity;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CameraLocationEntity],
    }).compile();

    service = module.get<CameraLocationEntity>(CameraLocationEntity);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

