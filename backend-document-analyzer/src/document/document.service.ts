import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateDocumentDto } from './dto/create-document.dto';
import { UpdateDocumentDto } from './dto/update-document.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOneOptions, Repository } from 'typeorm';
import { Document } from './entities/document.entity';
import { Candidat } from 'src/candidat/entities/candidat.entity';

@Injectable()
export class DocumentService {
  constructor(
    @InjectRepository(Document)
    private readonly documentRepository: Repository<Document>,
    @InjectRepository(Candidat)
    private candidatRepository: Repository<Candidat>,
  ) {}

  async createDocument(
    createDocumentDto: CreateDocumentDto,
  ): Promise<Document> {
    try {
      const newDocument = new Document();
      newDocument.nom = createDocumentDto.file;
      newDocument.type = 'document';
      newDocument.dateTelechargement = new Date();
      newDocument.file = createDocumentDto.file;
      newDocument.status = 'Pending';
      //const newDocument = this.documentRepository.create(createDocumentDto);
      const savedDoc = await this.documentRepository.save(newDocument);
      return savedDoc;
    } catch (error) {
      throw error;
    }
  }

  async findOne(options: FindOneOptions<Document>): Promise<Document> {
    const document = await this.documentRepository.findOne(options);
    if (!document) {
      throw new NotFoundException(`Document not found`);
    }
    return document;
  }
  async findById(id: number): Promise<Document> {
    const document = await this.documentRepository.findOneBy({ id });

    if (!document) {
      throw new NotFoundException(`Document with ID ${id} not found`);
    }

    return document;
  }

  async addDocumentForUser(
    userId: number,
    createDocumentDto: CreateDocumentDto,
  ): Promise<Document> {
    const option: FindOneOptions<Candidat> = { where: { id_candidat: userId } };
    const user = await this.candidatRepository.findOne(option);

    if (!user) {
      throw new Error(`User with id ${userId} not found`);
    }

    const document = new Document();
    document.nom = createDocumentDto.nom;
    document.type = createDocumentDto.type;
    document.dateTelechargement = new Date();
    document.file = createDocumentDto.file;
    document.status = createDocumentDto.status;
    document.candidat = user;

    return await this.documentRepository.save(document);
  }
}
