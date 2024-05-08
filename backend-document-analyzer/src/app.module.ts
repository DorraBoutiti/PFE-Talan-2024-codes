import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DocumentModule } from './document/document.module';
import { InformationsExtraitesModule } from './informations-extraites/informations-extraites.module';
import { MailModule } from './mail/mail.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CandidatModule } from './candidat/candidat.module';
import { Candidat } from './candidat/entities/candidat.entity';
import { Document } from './document/entities/document.entity';
import { InformationExtraites } from './informations-extraites/entities/informations-extraite.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        name: 'default',
        type: 'mysql',
        host: configService.get('DB_HOST'),
        port: +configService.get('DB_PORT'),
        username: configService.get('DB_USER'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_DATABASE'),
        entities: [Candidat, Document, InformationExtraites],
        synchronize: false,
      }),
    }),   
    CandidatModule,
    DocumentModule,
    InformationsExtraitesModule,
    MailModule,
  ],
  controllers: [],
})
export class AppModule {}
