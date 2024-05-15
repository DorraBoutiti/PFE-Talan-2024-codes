import { Module } from '@nestjs/common';
import { CandidatService } from './candidat.service';
import { CandidatController } from './candidat.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Candidat } from './entities/candidat.entity';
import { MailModule } from '../mail/mail.module';
import { Document } from '../document/entities/document.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Candidat, Document]), MailModule, ],
  controllers: [CandidatController],
  providers: [CandidatService],
  exports: []
})
export class CandidatModule {}
