import { Test, TestingModule } from '@nestjs/testing';
import { InformationsExtraitesService } from './informations-extraites.service';

describe('InformationsExtraitesService', () => {
  let service: InformationsExtraitesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [InformationsExtraitesService],
    }).compile();

    service = module.get<InformationsExtraitesService>(InformationsExtraitesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
