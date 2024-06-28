import { Module } from '@nestjs/common';
import { DocumentService } from './document.service';
import { DocumentController } from './document.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Document } from './entities/document.entity';
import { CandidatModule } from '../candidat/candidat.module';
import { Candidat } from '../candidat/entities/candidat.entity';
import { InformationsExtraitesModule } from '../informations-extraites/informations-extraites.module';
import { HttpModule } from '@nestjs/axios';
import { InformationExtraitesRepository } from '../informations-extraites/information-extraites.repository';
import { InformationExtraites } from '../informations-extraites/entities/informations-extraite.entity';

@Module({

  controllers: [DocumentController],
  providers: [DocumentService, InformationExtraitesRepository],
  exports: [DocumentService, InformationExtraitesRepository],
  imports: [TypeOrmModule.forFeature([Document, Candidat, InformationExtraites]), CandidatModule, InformationsExtraitesModule, HttpModule],
})
export class DocumentModule {}
