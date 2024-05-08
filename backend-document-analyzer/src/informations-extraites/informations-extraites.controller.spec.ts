import { Test, TestingModule } from '@nestjs/testing';
import { InformationsExtraitesController } from './informations-extraites.controller';
import { InformationsExtraitesService } from './informations-extraites.service';

describe('InformationsExtraitesController', () => {
  let controller: InformationsExtraitesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [InformationsExtraitesController],
      providers: [InformationsExtraitesService],
    }).compile();

    controller = module.get<InformationsExtraitesController>(InformationsExtraitesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
