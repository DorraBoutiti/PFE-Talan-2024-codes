import { Module } from '@nestjs/common';
import { InformationsExtraitesService } from './informations-extraites.service';
import { InformationsExtraitesController } from './informations-extraites.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InformationExtraites } from './entities/informations-extraite.entity';
@Module({
  controllers: [InformationsExtraitesController],
  providers: [InformationsExtraitesService],
  imports: [TypeOrmModule.forFeature([InformationExtraites])],
  exports: [InformationsExtraitesService],
})
export class InformationsExtraitesModule {}
