import { Injectable } from '@nestjs/common';
import { CreateInformationsExtraiteDto } from './dto/create-informations-extraite.dto';
import { InformationExtraites } from './entities/informations-extraite.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Document } from 'src/document/entities/document.entity';

@Injectable()
export class InformationsExtraitesService {
  constructor(
    @InjectRepository(InformationExtraites)
    private readonly informationExtraitesRepository: Repository<InformationExtraites>,    
  ) {}
  async addInformationsExtraiteForDocument(
    
    createInformationsExtraiteDto: CreateInformationsExtraiteDto,
    _document: Document,
  ): Promise<InformationExtraites> {
    const informationsExtraite = new InformationExtraites();
    informationsExtraite.document = _document;
    informationsExtraite.nomChamp = createInformationsExtraiteDto.nomChamp;
    informationsExtraite.valeur = createInformationsExtraiteDto.valeur;

    return await this.informationExtraitesRepository.save(informationsExtraite);
  }
}
