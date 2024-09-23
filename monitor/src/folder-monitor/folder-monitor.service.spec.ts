import { Test, TestingModule } from '@nestjs/testing';
import { FolderMonitorService } from './folder-monitor.service';

describe('FolderMonitorService', () => {
  let service: FolderMonitorService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FolderMonitorService],
    }).compile();

    service = module.get<FolderMonitorService>(FolderMonitorService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
