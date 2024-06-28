import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateDocumentDto } from './dto/create-document.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOneOptions, Repository } from 'typeorm';
import { Document } from './entities/document.entity';
import { Candidat } from '../candidat/entities/candidat.entity';
import { InformationExtraites } from 'src/informations-extraites/entities/informations-extraite.entity';
import { SkillDto } from './dto/create-skill.dto';
import { ExtractedInformationDto } from './dto/extract-info.dto';
import { InformationExtraitesRepository } from '../informations-extraites/information-extraites.repository';

@Injectable()
export class DocumentService {
  constructor(
    @InjectRepository(Document)
    private readonly documentRepository: Repository<Document>,
    @InjectRepository(Candidat)
    private candidatRepository: Repository<Candidat>,
    @InjectRepository(InformationExtraites)
    private readonly infoRepository: InformationExtraitesRepository,
  ) { }


  async createDocument(
    createDocumentDto: CreateDocumentDto,
  ): Promise<Document> {
    try {
      const newDocument = new Document();
      newDocument.nom = createDocumentDto.file;
      newDocument.type = createDocumentDto.type;
      newDocument.dateTelechargement = new Date();
      newDocument.file = createDocumentDto.file;
      newDocument.status = createDocumentDto.status;
      newDocument.candidat = createDocumentDto.candidat;      
      const savedDoc = await this.documentRepository.save(newDocument);
      return savedDoc;
    } catch (error) {
      throw error;
    }
  }

  async getDocumentsByCandidatId(candidatId: number): Promise<string[]> {
    const documents = await this.documentRepository
      .createQueryBuilder('document')
      .select('document.type', 'type')
      .leftJoin('document.candidat', 'candidat')
      .where('candidat.id_candidat = :candidatId', { candidatId })
      .andWhere('document.status = :status', { status: 'pending' })
      .getRawMany();

    return documents.map((document) => document.type);
  }

  /**
   * Retrieves the details of all documents associated with a given candidate.
   * 
   * @param id - The ID of the candidate.
   * @returns An array of partial documents, containing only the specified fields.
   */
  async getDocumentsDetailsByCandidatId(candidateId: number, filterName?: string): Promise<Partial<Document>[]> {
  let query = this.documentRepository.createQueryBuilder('document')
    .select([
      'document.id',
      'document.nom',
      'document.type',
      'document.dateTelechargement',
      'document.status'
    ])
    .where('document.candidat.id_candidat = :id', { id: candidateId })
    .andWhere('document.type != :type', { type: 'INTER' });

  if (filterName) {
    query = query.andWhere('document.type LIKE :filterName', { filterName: `%${filterName}%` });
  }

  const result = await query.getRawMany();
  return result;
}




  async findOne(options: FindOneOptions<Document>): Promise<Document> {
    const document = await this.documentRepository.findOne(options);
    if (!document) {
      throw new NotFoundException(`Document not found`);
    }
    return document;
  }
  async findById(id: number): Promise<Document> {
    const document = await this.documentRepository.findOne({ where: { id } });

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

    const savedDoc = await this.documentRepository.save(document);
    console.log("the document saved");
          console.log('informations', createDocumentDto.informations);
      const informationEntities: InformationExtraites[] = [];

      for (const key in createDocumentDto.informations) {
        const info = new InformationExtraites();
        info.document = savedDoc;
        info.nomChamp = key;
        info.valeur = createDocumentDto.informations[key].toString();
        informationEntities.push(info);
      }
      const savedInformation = await this.infoRepository.save(informationEntities);
      console.log('savedInformation', savedInformation);
  

    return savedDoc;
  }
async saveExtractedInformation(documentId: number, transformedResponse: any) {
    if (!documentId) {
        throw new Error('Document ID is undefined or null');
    }
    const option: FindOneOptions<Document> = { where: { id: documentId } };
    const document = await this.documentRepository.findOne(option);

    if (!document) {
        throw new Error('Document not found');
  }
  const informationEntities: InformationExtraites[] = [];

  for (const key in transformedResponse) {      
        if (key !== 'global_score_percentage' && key !== 'filtered_skills') {
            const info = new InformationExtraites();
            info.document = document;
            info.nomChamp = key;
            info.valeur = transformedResponse[key].toString();
            informationEntities.push(info);
        }
  } 

    const globalScoreInfo = new InformationExtraites();
    globalScoreInfo.document = document;
  globalScoreInfo.nomChamp = 'Global Score Percentage';
  
  globalScoreInfo.valeur = transformedResponse.global_score_percentage.toString();
    informationEntities.push(globalScoreInfo);
    const savedInformation = await this.infoRepository.save(informationEntities);
    return this.findById(documentId);
  }
  
  async getInterviewsByCandidatId(candidatId: number): Promise<Document[]> {
    const documents = await this.documentRepository.find({ where: { id_candidat : candidatId, type: 'INTER' } });

    if (!documents) {
      throw new NotFoundException(`Document for user with ID ${candidatId} not found`);
    }

    return documents;
    
  }

  async addDocumentsRequest(candidatId: number, addDocuments: string[]): Promise<Document[]> {
    const existingCandidat = await this.candidatRepository.findOne({ where: { id_candidat: candidatId } });
    if (!existingCandidat) {
      throw new NotFoundException(`Candidat with ID ${candidatId} not found`);
    }

    const documents: Document[] = [];

    for (const documentType of addDocuments) {
      const document = new CreateDocumentDto();
      document.nom = "------------";
      document.type = documentType;
      document.status = 'pending';
      document.file = "";
      document.candidat = existingCandidat;
      const newDocument = await this.addDocumentForUser(candidatId, document);
      documents.push(newDocument);
    }

    return documents;    
  }




}
