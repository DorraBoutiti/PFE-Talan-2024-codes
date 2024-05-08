import { Module } from '@nestjs/common';
import { DocumentService } from './document.service';
import { DocumentController } from './document.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Document } from './entities/document.entity';
import { CandidatModule } from 'src/candidat/candidat.module';
import { Candidat } from 'src/candidat/entities/candidat.entity';
import { InformationsExtraitesModule } from 'src/informations-extraites/informations-extraites.module';
import { HttpModule } from '@nestjs/axios';

@Module({
  controllers: [DocumentController],
  providers: [DocumentService],
  imports: [TypeOrmModule.forFeature([Document, Candidat]), CandidatModule, InformationsExtraitesModule, HttpModule],
})
export class DocumentModule {}
