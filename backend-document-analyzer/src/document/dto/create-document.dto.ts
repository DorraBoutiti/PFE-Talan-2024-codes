import {
  IsString,
  IsNotEmpty,
  IsDateString,
  ValidateNested,
  IsArray,
  IsOptional,
} from 'class-validator';
import { Type } from 'class-transformer';
import { CreateInformationsExtraiteDto } from '../../informations-extraites/dto/create-informations-extraite.dto';
import { Candidat } from '../../candidat/entities/candidat.entity';

export class CreateDocumentDto {
  @IsNotEmpty()
  @IsString()
  nom: string;

  @IsNotEmpty()
  @IsString()
  type: string;

  @IsNotEmpty()
  @IsDateString()
  dateTelechargement: Date;

  @IsNotEmpty()
  @IsString()
  file: string;

  @IsNotEmpty()
  @IsString()
  status: string;

  @ValidateNested({ each: true })
  @IsArray()
  @Type(() => CreateInformationsExtraiteDto)
  @IsOptional()
  informations: CreateInformationsExtraiteDto[];

  candidat: Candidat;
}
