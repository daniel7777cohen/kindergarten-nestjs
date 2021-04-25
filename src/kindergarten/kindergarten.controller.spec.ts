import { Test, TestingModule } from '@nestjs/testing';
import { KindergartenController } from './kindergarten.controller';

describe('KindergartenController', () => {
  let controller: KindergartenController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [KindergartenController],
    }).compile();

    controller = module.get<KindergartenController>(KindergartenController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
