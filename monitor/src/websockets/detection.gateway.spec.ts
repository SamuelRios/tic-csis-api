import { Test, TestingModule } from '@nestjs/testing';
import { DetectionGateway } from './detection.gateway';

describe('DetectionGateway', () => {
  let gateway: DetectionGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DetectionGateway],
    }).compile();

    gateway = module.get<DetectionGateway>(DetectionGateway);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });
});
