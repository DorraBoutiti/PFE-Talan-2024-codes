import { IsNumber, IsString, IsNotEmpty } from 'class-validator';
import { Document } from '../../document/entities/document.entity';

export class CreateInformationsExtraiteDto {
  @IsNotEmpty()
  document: Document;
  
  @IsNotEmpty()
  @IsString()
  nomChamp: string;

  @IsNotEmpty()
  @IsString()
  valeur: string;
}
