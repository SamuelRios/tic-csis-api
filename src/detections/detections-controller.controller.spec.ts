import { Test, TestingModule } from '@nestjs/testing';
import { DetectionsControllerController } from './detections-controller.controller';

describe('DetectionsControllerController', () => {
  let controller: DetectionsControllerController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DetectionsControllerController],
    }).compile();

    controller = module.get<DetectionsControllerController>(DetectionsControllerController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
