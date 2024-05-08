import { Module } from '@nestjs/common';
import { CandidatService } from './candidat.service';
import { CandidatController } from './candidat.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Candidat } from './entities/candidat.entity';
import { MailModule } from 'src/mail/mail.module';

@Module({
  imports: [TypeOrmModule.forFeature([Candidat]), MailModule],
  controllers: [CandidatController],
  providers: [CandidatService],
  exports: []
})
export class CandidatModule {}
