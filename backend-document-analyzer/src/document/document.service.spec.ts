import { Test, TestingModule } from '@nestjs/testing';
import { DocumentService } from './document.service';
import { Repository, DeepPartial } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Document } from './entities/document.entity';
import { Candidat } from '../candidat/entities/candidat.entity';
import { NotFoundException } from '@nestjs/common';
import { CreateDocumentDto } from './dto/create-document.dto';


describe('DocumentService', () => {
  let service: DocumentService;
  let documentRepository: Repository<Document>;
  let candidatRepository: Repository<Candidat>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DocumentService,
        {
          provide: getRepositoryToken(Document),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(Candidat),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<DocumentService>(DocumentService);
    documentRepository = module.get<Repository<Document>>(
      getRepositoryToken(Document),
    );
    candidatRepository = module.get<Repository<Candidat>>(
      getRepositoryToken(Candidat),
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createDocument', () => {
    it('should create a new document', async () => {
      const createDocumentDto: CreateDocumentDto = {
        nom: 'Test Document',
        type: 'test',
        dateTelechargement: new Date(),
        file: 'test.pdf',
        status: 'Pending',
        candidat: {} as Candidat,
        informations: [],
      };

      const mockDocument = new Document();
      mockDocument.id = 1;
      mockDocument.nom = createDocumentDto.nom;
      mockDocument.type = createDocumentDto.type;
      mockDocument.dateTelechargement = createDocumentDto.dateTelechargement;
      mockDocument.file = createDocumentDto.file;
      mockDocument.status = createDocumentDto.status;

      jest.spyOn(documentRepository, 'save').mockResolvedValue(mockDocument);

      const result = await service.createDocument(createDocumentDto);

      expect(result).toEqual(mockDocument);
    });
  });

  describe('findOne', () => {
    it('should find a document by options', async () => {
      const mockDocument = new Document();
      mockDocument.id = 1;

      jest.spyOn(documentRepository, 'findOne').mockResolvedValue(mockDocument);

      const result = await service.findOne({ where: { id: 1 } });

      expect(result).toEqual(mockDocument);
    });

    it('should throw NotFoundException if document not found', async () => {
      jest.spyOn(documentRepository, 'findOne').mockResolvedValue(null);

      await expect(service.findOne({ where: { id: 999 } })).rejects.toThrowError(
        NotFoundException,
      );
    });
  });

  describe('findById', () => {
    it('should find a document by id', async () => {
      const mockDocument = new Document();
      mockDocument.id = 1;

      jest.spyOn(documentRepository, 'findOne').mockResolvedValue(mockDocument);

      const result = await service.findById(1);

      expect(result).toEqual(mockDocument);
    });

    it('should throw NotFoundException if document not found', async () => {
      jest.spyOn(documentRepository, 'findOne').mockResolvedValue(null);

      await expect(service.findById(999)).rejects.toThrowError(
        NotFoundException,
      );
    });
  });


  describe('addDocumentForUser', () => {
    it('should add a document for a user', async () => {
      const mockCandidat = new Candidat();
      mockCandidat.id_candidat = 1;
      const createDocumentDto: CreateDocumentDto = {
        nom: 'Test Document',
        type: 'test',
        dateTelechargement: new Date(),
        file: 'test.pdf',
        status: 'Pending',
        candidat: mockCandidat,
        informations: [],
      };

      jest.spyOn(candidatRepository, 'findOne').mockResolvedValue(mockCandidat);
      jest.spyOn(documentRepository, 'save').mockImplementation((doc) => Promise.resolve(doc as DeepPartial<Document> & Document));

      const result = await service.addDocumentForUser(1, createDocumentDto);

      expect(result.nom).toEqual(createDocumentDto.nom);
      expect(result.candidat).toEqual(mockCandidat);
    });

    it('should throw error if user not found', async () => {
      jest.spyOn(candidatRepository, 'findOne').mockResolvedValue(null);

      await expect(service.addDocumentForUser(999, {} as CreateDocumentDto)).rejects.toThrowError();
    });
  });
});
