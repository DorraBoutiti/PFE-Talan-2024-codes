import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, HttpStatus } from '@nestjs/common';
import * as request from 'supertest';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DocumentModule } from '../src/document/document.module';
import { DocumentService } from '../src/document/document.service';
import { InformationsExtraitesService } from '../src/informations-extraites/informations-extraites.service';
import { CreateDocumentDto } from '../src/document/dto/create-document.dto';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Document } from '../src/document/entities/document.entity';
import { Candidat } from '../src/candidat/entities/candidat.entity';
import { DataSource } from 'typeorm';

describe('DocumentController (e2e)', () => {
  let app: INestApplication;
  let documentService = { addDocumentForUser: jest.fn(), getDocumentsByCandidatId: jest.fn(), findById: jest.fn() };
  let informationsExtraitesService = { addInformationsExtraiteForDocument: jest.fn() };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: 'sqlite',
          database: ':memory:',
          entities: [Document, Candidat],
          synchronize: true,
        }),
        TypeOrmModule.forFeature([Document, Candidat]),
        DocumentModule,
      ],
    })
      .overrideProvider(DocumentService)
      .useValue(documentService)
      .overrideProvider(InformationsExtraitesService)
      .useValue(informationsExtraitesService)
      .overrideProvider(getRepositoryToken(Document))
      .useValue({})
      .overrideProvider(getRepositoryToken(Candidat))
      .useValue({})
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/POST document (createDocument)', async () => {
    const filePath = './test/sample.txt';
    const response = await request(app.getHttpServer())
      .post('/document')
      .attach('file', filePath)
      .field('candidatId', 1)
      .expect(HttpStatus.CREATED);

    expect(response.body.message).toBe('Document created successfully');
  });

  it('/GET document/Candidat/:candidatId (getDocumentsByCandidatId)', () => {
    const documents = [{ id: 1, name: 'Sample Doc' }];
    documentService.getDocumentsByCandidatId.mockResolvedValue(documents);

    return request(app.getHttpServer())
      .get('/document/Candidat/1')
      .expect(HttpStatus.OK)
      .expect(documents);
  });

  it('/GET document/:id (findById)', () => {
    const document = { id: 1, name: 'Sample Doc' };
    documentService.findById.mockResolvedValue(document);

    return request(app.getHttpServer())
      .get('/document/1')
      .expect(HttpStatus.OK)
      .expect(document);
  });

  // it('/POST document/:userId (addDocumentForUser)', async () => {
  //   const document = { id: 1, name: 'Sample Doc' };
  //   documentService.addDocumentForUser.mockResolvedValue(document);

  //   const createDocumentDto: CreateDocumentDto = {
  //     nom: 'Sample Doc',
  //     type: 'document',
  //     file: 'samplefiledata',
  //     dateTelechargement: new Date(),
  //     status: 'new',
  //     candidat: null,
  //     informations: [{ nomChamp: 'Field1', valeur: 'Value1', document: null }],
  //   };

  //   const response = await request(app.getHttpServer())
  //     .post('/document/1')
  //     .send({ userId: 1, createDocumentDto })
  //     .expect(HttpStatus.CREATED);

  //   expect(response.body.message).toBe('Document added successfully');
  // });

  afterAll(async () => {
    await app.close();
  });
});
