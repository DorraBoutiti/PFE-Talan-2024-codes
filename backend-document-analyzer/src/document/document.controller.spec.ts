import { Test, TestingModule } from '@nestjs/testing';
import { DocumentController } from './document.controller';
import { DocumentService } from './document.service';
import { CreateDocumentDto } from './dto/create-document.dto';
import { HttpStatus } from '@nestjs/common';
import { Document } from './entities/document.entity';

import { InformationExtraites } from '../informations-extraites/entities/informations-extraite.entity';
import { Repository } from 'typeorm'; // Import Repository from TypeORM
import { getRepositoryToken } from '@nestjs/typeorm'; // Import getRepositoryToken
import { Candidat } from '../candidat/entities/candidat.entity';
import { InformationsExtraitesService } from '../informations-extraites/informations-extraites.service'; // Import InformationsExtraitesService

describe('DocumentController', () => {
  let controller: DocumentController;
  let documentService: DocumentService;

  const mockInformationExtraites = {
    addInformationsExtraiteForDocument: jest.fn(),
    addDocumentForUser: jest.fn(),
    getDocumentsByCandidatId: jest.fn(),  // Add mock method
    findById: jest.fn(),  // Add mock method
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DocumentController],
      providers: [
        DocumentService,
        // Provide the DocumentRepository and CandidatRepository
        {
          provide: getRepositoryToken(Document),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(Candidat),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(InformationExtraites),
          useClass: Repository,
        },
        // Add InformationsExtraitesService to providers
        InformationsExtraitesService,

      ],
    }).overrideProvider(DocumentService)
      .useValue(mockInformationExtraites)
      .compile();

    controller = module.get<DocumentController>(DocumentController);
    documentService = module.get<DocumentService>(DocumentService);

  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create a new document', async () => {
    // Mock data for the document DTO
    const mockDocumentDto: CreateDocumentDto = {
      nom: 'Test Document',
      type: 'document',
      dateTelechargement: new Date(),
      file: 'test.pdf',
      status: 'Pending',
      informations: [], // Add empty array for informations
      candidat: null, // You don't need to mock candidat for this test
    };

    // Mock data for the file
    const mockFile = {
      originalname: 'test.pdf',
      filename: 'test.pdf',
      path: '/path/to/mock/file/test.pdf', // This path can be any path since we are not actually uploading a file
    };

    // Mock the return value of addDocumentForUser with a Document object
    const mockDocument: Document = {
      id: 1,
      ...mockDocumentDto,
      informations: [], // Ensure informations is of type InformationExtraites[]
      candidat: null, // Mock candidat if needed
    };

    // Mock the document service method
    jest.spyOn(documentService, 'addDocumentForUser').mockResolvedValue(mockDocument);

    // Mock the response object
    const mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };

    // Call the controller method with the mock file and candidatId
    await controller.createDocument(mockFile as any, 1, mockResponse as any);

    // Assert the response
    expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.CREATED);
    expect(mockResponse.json).toHaveBeenCalledWith({
      message: 'Document created successfully',
      status: HttpStatus.CREATED,
      document: mockDocument,
    });
  });
  it('should handle invalid file upload', async () => {
    // Mock the response object
    const mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };

    // Call the controller method with an invalid file (null)
    await controller.createDocument(null, 10, mockResponse as any);

    // Assert the response
    expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST);
    expect(mockResponse.json).toHaveBeenCalledWith({
      message: 'Invalid file uploaded',
      status: HttpStatus.BAD_REQUEST,
    });
  });

 it('should get documents by candidat ID', async () => {
  // Mock data
  const candidatId = 1;
  const documentIds: string[] = ['1', '2']; // Mock array of document IDs as strings

  // Mock the service method
  jest.spyOn(documentService, 'getDocumentsByCandidatId').mockResolvedValue(documentIds);

  // Call the controller method
  const result = await controller.getDocumentsByCandidatId(candidatId);

  // Assert the result
  expect(result).toEqual(documentIds);
});


it('should find a document by ID', async () => {
  // Mock data
  const documentId = 1;
  const document: Document = { id: documentId, nom: 'Test Document', type: 'document', dateTelechargement: new Date(), file: 'test.pdf', status: 'Pending', candidat: { id_candidat: 1, full_name: 'Candidat 1', email: 'X3YpC@example.com', docs: [] }, informations: [] }; // Adjust candidat property
  // Mock the service method
  jest.spyOn(documentService, 'findById').mockResolvedValue(document);

  // Call the controller method
  const result = await controller.findById(documentId);

  // Assert the result
  expect(result).toEqual(document);
});

// it('should add a document for a user', async () => {
//     // Mock data
//     const userId = 1;
//     const createDocumentDto: CreateDocumentDto = {
//       nom: 'Test Document',
//       type: 'document',
//       dateTelechargement: new Date(), // Fix property name
//       file: 'test.pdf',
//       status: 'Pending',
//       informations: [], // Assuming no extracted information for this test
//       candidat: { id_candidat: userId, full_name: 'Candidat 1', email: 'X3YpC@example.com', docs: [] }, // Adjust candidat property
//     };

//     // Create a mock Document object
//     const mockDocument: Document = {
//       id: 1,
//       ...createDocumentDto,
//     };

//     // Mock the service method
//     jest.spyOn(documentService, 'addDocumentForUser').mockResolvedValue(mockDocument);

//     // Mock the response object
//     const mockResponse = {
//       status: jest.fn().mockReturnThis(),
//       json: jest.fn().mockReturnThis(),
//     };

//     // Call the controller method
//     await controller.addDocumentForUser(userId, createDocumentDto, mockResponse as any);

//     // Assert the response
//     expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.CREATED);
//     expect(mockResponse.json).toHaveBeenCalledWith({
//       message: 'Document added successfully',
//       status: HttpStatus.CREATED,
//       document: mockDocument,
//     });
//   });
});
