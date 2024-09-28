import { Test, TestingModule } from '@nestjs/testing';
import { Monitor } from './monitor';

describe('MonitorService', () => {
  let service: Monitor;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [Monitor],
    }).compile();

    service = module.get<Monitor>(Monitor);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
