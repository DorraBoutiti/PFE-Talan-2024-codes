import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('Candidat Module (e2e)', () => {
  let app: INestApplication;
  let createdCandidatId: number;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });
  
  it('should fetch all candidats when there are none', async () => {
    // Assuming there are no candidats in the database
    // Ensure to clean up the database before running this test

    const response = await request(app.getHttpServer())
      .get('/candidat/all')
      .expect(200);

    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBe(0);
  });
  it('should create a candidat', async () => {
    const createCandidatDto = {
      full_name: 'John Doe',
      email: 'john@example.com',
      documents: [],
    };

    const response = await request(app.getHttpServer())
      .post('/candidat')
      .send(createCandidatDto)
      .expect(201);

    expect(response.body.message).toBe('Candidat created successfully');
    expect(response.body.data).toBeDefined();
    createdCandidatId = response.body.data.id_candidat;
  });

  it('should fetch all candidats', async () => {
    const response = await request(app.getHttpServer())
      .get('/candidat/all')
      .expect(200);

    expect(Array.isArray(response.body)).toBe(true);
  });

  it('should fetch a specific candidat', async () => {
    const response = await request(app.getHttpServer())
      .get(`/candidat/${createdCandidatId}`)
      .expect(200);

    expect(response.body.id_candidat).toBe(createdCandidatId);
  });

  it('should update a candidat', async () => {
    const updateCandidatDto = {
      full_name: 'Jane Doe',
      email: 'jane@example.com',
    };

    const response = await request(app.getHttpServer())
      .patch(`/candidat/${createdCandidatId}`)
      .send(updateCandidatDto)
      .expect(200);

    expect(response.body.message).toBe(`Candidat with ID ${createdCandidatId} updated successfully`);
  });

  it('should delete a candidat', async () => {
    const response = await request(app.getHttpServer())
      .delete(`/candidat/${createdCandidatId}`)
      .expect(200);

    expect(response.body.message).toBe(`Candidat with ID ${createdCandidatId} removed successfully`);
  });

  it('should search for candidats', async () => {
    const searchQuery = 'John';
    const response = await request(app.getHttpServer())
      .post('/candidat/search')
      .send({ query: searchQuery })
      .expect(200);

    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.every(candidat => candidat.full_name.includes(searchQuery))).toBe(true);
  });

  it('should fail to create a candidat with missing required fields', async () => {
    const createCandidatDto = {
      full_name: 'John Doe',
      documents: [],
    };

    await request(app.getHttpServer())
      .post('/candidat')
      .send(createCandidatDto)
      .expect(500);
  });
  it('should fetch all candidats when there are none', async () => {
    // Assuming there are no candidats in the database
    // Ensure to clean up the database before running this test

    const response = await request(app.getHttpServer())
      .get('/candidat/all')
      .expect(200);

    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBe(0);
  });

  it('should fail to fetch a specific candidat with invalid ID', async () => {
    const invalidId = 999999; // Non-existing ID

    await request(app.getHttpServer())
      .get(`/candidat/${invalidId}`)
      .expect(500);
  });

  it('should fail to update a candidat with invalid data', async () => {
    const updateCandidatDto = {
      nom: 'John Doe',
    };

    await request(app.getHttpServer())
      .patch(`/candidat/${createdCandidatId}`)
      .send(updateCandidatDto)
      .expect(500);
  });

  it('should fail to delete a non-existing candidat', async () => {
    const nonExistingId = 999999; // Non-existing ID

    await request(app.getHttpServer())
      .delete(`/candidat/${nonExistingId}`)
      .expect(500);
  });

});
