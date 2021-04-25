import { Test, TestingModule } from '@nestjs/testing';
import { KindergartenService } from './kindergarten.service';

describe('KindergartenService', () => {
  let service: KindergartenService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [KindergartenService],
    }).compile();

    service = module.get<KindergartenService>(KindergartenService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
