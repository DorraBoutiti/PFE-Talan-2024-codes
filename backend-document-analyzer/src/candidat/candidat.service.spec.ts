import { Test, TestingModule } from '@nestjs/testing';
import { CandidatService } from './candidat.service';
import { Document } from '../document/entities/document.entity';
import { MailService } from '../mail/mail.service';
import { Repository, FindOneOptions } from 'typeorm';
import { Candidat } from './entities/candidat.entity';
import { NotFoundException } from '@nestjs/common';

describe('CandidatService', () => {
  let service: CandidatService;
  let candidatRepository: Repository<Candidat>;
  let documentRepository: Repository<Document>;
  let mailService: MailService;
 

  const mockCandidatRepository = {
    find: jest.fn(),
    findOne: jest.fn(),
    save: jest.fn(),
    remove: jest.fn(),
    create: jest.fn(),
  };
  const mockDocumentRepository = {
    create: jest.fn(),
    save: jest.fn(),
  };

  const mockMailService = {
    sendUserConfirmation: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CandidatService,
        { provide: 'CandidatRepository', useValue: mockCandidatRepository },
        { provide: 'DocumentRepository', useValue: mockDocumentRepository },
        { provide: MailService, useValue: mockMailService },
      ],
    }).compile();

    service = module.get<CandidatService>(CandidatService);
    candidatRepository = module.get('CandidatRepository');
    documentRepository = module.get('DocumentRepository');
    mailService = module.get<MailService>(MailService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createCandidat', () => {
    it('should create a new candidat and send confirmation email', async () => {
      // Mock data
      const createCandidatDto = { full_name: 'John Doe', email: 'john@example.com', documents: [] };
      const candidat = new Candidat();
      const savedCandidat = new Candidat();

      // Mock repository methods
      mockCandidatRepository.create.mockReturnValue(candidat);
      mockCandidatRepository.save.mockResolvedValue(savedCandidat);

      // Call the method
      await service.createCandidat(createCandidatDto);

      // Assertions
      expect(mockCandidatRepository.create).toHaveBeenCalledWith({
        full_name: createCandidatDto.full_name,
        email: createCandidatDto.email,
      });

      expect(mockCandidatRepository.save).toHaveBeenCalledWith(candidat);
      expect(mockMailService.sendUserConfirmation).toHaveBeenCalledWith(savedCandidat.full_name, savedCandidat.email, savedCandidat.id_candidat);
    });
  });

  describe('findAll', () => {
    it('should return all candidats', async () => {
      const mockCandidats: Candidat[] = [{ id_candidat: 1, full_name: 'John Doe', email: 'john@example.com', docs:[] }];
      mockCandidatRepository.find.mockResolvedValueOnce(mockCandidats);

      const candidats = await service.findAll();

      expect(candidats).toEqual(mockCandidats);
    });
  });

  describe('findOne', () => {
    it('should return a candidat by id', async () => {
      const mockCandidat: Candidat = { id_candidat: 1, full_name: 'John Doe', email: 'john@example.com', docs: [] };
      const findOneOptions: FindOneOptions<Candidat> = { where: { id_candidat: mockCandidat.id_candidat } };
      mockCandidatRepository.findOne.mockResolvedValueOnce(mockCandidat);

      const candidat = await service.findOne(findOneOptions);

      expect(candidat).toEqual(mockCandidat);
    });

    it('should throw NotFoundException if candidat is not found', async () => {
      const findOneOptions: FindOneOptions<Candidat> = { where: { id_candidat: 999 } };
      mockCandidatRepository.findOne.mockResolvedValueOnce(undefined);

      await expect(service.findOne(findOneOptions)).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update a candidat by id', async () => {
      const mockCandidat: Candidat = { id_candidat: 1, full_name: 'John Doe', email: 'john@example.com', docs: [] };
      const findOneOptions: FindOneOptions<Candidat> = { where: { id_candidat: mockCandidat.id_candidat } };
      const updatedData = { full_name: 'Jane Doe' };
      const updatedCandidat: Candidat = { ...mockCandidat, ...updatedData };
      mockCandidatRepository.findOne.mockResolvedValueOnce(mockCandidat);
      mockCandidatRepository.save.mockResolvedValueOnce(updatedCandidat);

      const candidat = await service.update(findOneOptions, updatedData);

      expect(candidat).toEqual(updatedCandidat);
    });

    it('should throw NotFoundException if candidat is not found', async () => {
      const findOneOptions: FindOneOptions<Candidat> = { where: { id_candidat: 999 } };
      mockCandidatRepository.findOne.mockResolvedValueOnce(undefined);

      await expect(service.update(findOneOptions, {})).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should remove a candidat by id', async () => {
      const mockCandidat: Candidat = { id_candidat: 1, full_name: 'John Doe', email: 'john@example.com', docs: [] };
      const findOneOptions: FindOneOptions<Candidat> = { where: { id_candidat: mockCandidat.id_candidat } };
      mockCandidatRepository.findOne.mockResolvedValueOnce(mockCandidat);

      await service.remove(findOneOptions);

      expect(mockCandidatRepository.remove).toHaveBeenCalledWith(mockCandidat);
    });

    it('should throw NotFoundException if candidat is not found', async () => {
      const findOneOptions: FindOneOptions<Candidat> = { where: { id_candidat: 999 } };
      mockCandidatRepository.findOne.mockResolvedValueOnce(undefined);

      await expect(service.remove(findOneOptions)).rejects.toThrow(NotFoundException);
    });
  });

  describe('search', () => {
  it('should return candidats matching the query', async () => {
    const query = 'John';
    const mockCandidats: Candidat[] = [
      { id_candidat: 1, full_name: 'John Doe', email: 'john@example.com', docs: [] },
      { id_candidat: 2, full_name: 'Jane Smith', email: 'jane@example.com', docs: [] },
    ];
    mockCandidatRepository.find.mockResolvedValueOnce(mockCandidats);

    const result = await service.search(query);

    // Expect both candidats whose full_name matches the query to be returned
    expect(result).toEqual([
      { id_candidat: 1, full_name: 'John Doe' },
      { id_candidat: 2, full_name: 'Jane Smith' },
    ]);
  });

  it('should return an empty array if no candidats match the query', async () => {
    const query = 'Unknown';
    mockCandidatRepository.find.mockResolvedValueOnce([]);

    const result = await service.search(query);

    expect(result).toEqual([]);
  });
});


  
});
