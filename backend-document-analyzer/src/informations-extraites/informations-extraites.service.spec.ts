import { Test, TestingModule } from '@nestjs/testing';
import { InformationsExtraitesService } from './informations-extraites.service';
import { InformationExtraites } from './entities/informations-extraite.entity';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Document } from '../document/entities/document.entity';
import { CreateInformationsExtraiteDto } from './dto/create-informations-extraite.dto';

describe('InformationsExtraitesService', () => {
  let service: InformationsExtraitesService;
  let repository: Repository<InformationExtraites>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        InformationsExtraitesService,
        {
          provide: getRepositoryToken(InformationExtraites),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<InformationsExtraitesService>(InformationsExtraitesService);
    repository = module.get<Repository<InformationExtraites>>(getRepositoryToken(InformationExtraites));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('addInformationsExtraiteForDocument', () => {
    it('should add information extraite for a document', async () => {
      const createInformationsExtraiteDto: CreateInformationsExtraiteDto = {
        nomChamp: 'Test Field',
        valeur: 'Test Value',
        document: { id: 1, nom: 'Test Document', type: 'test', dateTelechargement: new Date(), file: 'test.pdf', status: 'Pending', informations: [], candidat: null },
      };

      const mockDocument: Document = new Document();
      mockDocument.id = 1;

      const mockInformationExtraites: InformationExtraites = {
        id: 1,
        nomChamp: 'Test Field',
        valeur: 'Test Value',
        document: mockDocument,
      } as InformationExtraites;

      jest.spyOn(repository, 'save').mockResolvedValue(mockInformationExtraites);

      const result = await service.addInformationsExtraiteForDocument(createInformationsExtraiteDto, mockDocument);

      expect(result).toEqual(mockInformationExtraites);
      expect(repository.save).toHaveBeenCalledWith(expect.objectContaining({
        document: mockDocument,
        nomChamp: createInformationsExtraiteDto.nomChamp,
        valeur: createInformationsExtraiteDto.valeur,
      }));
    });
  });
});
