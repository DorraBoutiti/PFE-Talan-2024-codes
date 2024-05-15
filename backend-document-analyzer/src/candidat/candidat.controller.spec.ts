import { Test, TestingModule } from '@nestjs/testing';
import { CandidatController } from './candidat.controller';
import { CandidatService } from './candidat.service';
import { MailService } from '../mail/mail.service';
import { CandidatModule } from './candidat.module';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Candidat } from './entities/candidat.entity';
import { Document } from '../document/entities/document.entity'; // Import Document entity

describe('CandidatController', () => {
  let controller: CandidatController;
  let service: CandidatService;
  let repository: Repository<Candidat>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [CandidatModule],
      controllers: [CandidatController],
      providers: [
        CandidatService,
        MailService,
        {
          provide: getRepositoryToken(Candidat),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(Document),
          useClass: Repository, // Provide Repository<Document> for Document token
        },
      ],
    }).compile();

    controller = module.get<CandidatController>(CandidatController);
    service = module.get<CandidatService>(CandidatService);
    repository = module.get<Repository<Candidat>>(getRepositoryToken(Candidat));
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
