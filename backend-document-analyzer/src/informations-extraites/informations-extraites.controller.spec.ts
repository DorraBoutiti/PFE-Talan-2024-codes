import { Test, TestingModule } from '@nestjs/testing';
import { InformationsExtraitesController } from './informations-extraites.controller';
import { InformationsExtraitesService } from './informations-extraites.service';
import { CreateInformationsExtraiteDto } from './dto/create-informations-extraite.dto';
import { UpdateInformationsExtraiteDto } from './dto/update-informations-extraite.dto';
import { InformationExtraites } from './entities/informations-extraite.entity';

describe('InformationsExtraitesController', () => {
  let controller: InformationsExtraitesController;
  let service: InformationsExtraitesService;

  const mockInformationsExtraitesService = {
    create: jest.fn(),
    findAllByDocumentId: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
    addInformationsExtraiteForDocument: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [InformationsExtraitesController],
      providers: [
        {
          provide: InformationsExtraitesService,
          useValue: mockInformationsExtraitesService,
        },
      ],
    }).compile();

    controller = module.get<InformationsExtraitesController>(InformationsExtraitesController);
    service = module.get<InformationsExtraitesService>(InformationsExtraitesService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  // describe('create', () => {
  //   it('should call service.create with the correct parameters', async () => {
  //     const dto: CreateInformationsExtraiteDto = { nomChamp: 'Field', valeur: 'Value' };
  //     const result = new InformationExtraites();
  //     jest.spyOn(service, 'create').mockResolvedValue(result);

  //     await controller.create(dto);
  //     expect(service.create).toHaveBeenCalledWith(dto);
  //   });
  // });

  // describe('findAllByDocumentId', () => {
  //   it('should call service.findAllByDocumentId with the correct parameters', async () => {
  //     const idDocument = 1;
  //     const result = [new InformationExtraites()];
  //     jest.spyOn(service, 'findAllByDocumentId').mockResolvedValue(result);

  //     expect(await controller.findAllByDocumentId(idDocument)).toBe(result);
  //     expect(service.findAllByDocumentId).toHaveBeenCalledWith(idDocument);
  //   });
  // });

  // describe('findAll', () => {
  //   it('should call service.findAll', async () => {
  //     const result = [new InformationExtraites()];
  //     jest.spyOn(service, 'findAll').mockResolvedValue(result);

  //     expect(await controller.findAll()).toBe(result);
  //     expect(service.findAll).toHaveBeenCalled();
  //   });
  // });

  // describe('findOne', () => {
  //   it('should call service.findOne with the correct parameters', async () => {
  //     const id = '1';
  //     const result = new InformationExtraites();
  //     jest.spyOn(service, 'findOne').mockResolvedValue(result);

  //     expect(await controller.findOne(id)).toBe(result);
  //     expect(service.findOne).toHaveBeenCalledWith(+id);
  //   });
  // });

  // describe('update', () => {
  //   it('should call service.update with the correct parameters', async () => {
  //     const id = '1';
  //     const dto: UpdateInformationsExtraiteDto = { nomChamp: 'Updated Field', valeur: 'Updated Value' };
  //     const result = new InformationExtraites();
  //     jest.spyOn(service, 'update').mockResolvedValue(result);

  //     expect(await controller.update(id, dto)).toBe(result);
  //     expect(service.update).toHaveBeenCalledWith(+id, dto);
  //   });
  // });

  // describe('remove', () => {
  //   it('should call service.remove with the correct parameters', async () => {
  //     const id = '1';
  //     const result = new InformationExtraites();
  //     jest.spyOn(service, 'remove').mockResolvedValue(result);

  //     expect(await controller.remove(id)).toBe(result);
  //     expect(service.remove).toHaveBeenCalledWith(+id);
  //   });
  // });

  // describe('addInformationsExtraiteForDocument', () => {
  //   it('should call service.addInformationsExtraiteForDocument with the correct parameters', async () => {
  //     const documentId = 1;
  //     const dto: CreateInformationsExtraiteDto = { nomChamp: 'Field', valeur: 'Value' };
  //     const result = new InformationExtraites();
  //     jest.spyOn(service, 'addInformationsExtraiteForDocument').mockResolvedValue(result);

  //     expect(await controller.addInformationsExtraiteForDocument(documentId, dto)).toBe(result);
  //     expect(service.addInformationsExtraiteForDocument).toHaveBeenCalledWith(documentId, dto);
  //   });
  // });
});
