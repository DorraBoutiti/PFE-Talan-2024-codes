import { IsNumber, IsString, IsNotEmpty } from 'class-validator';

export class CreateInformationsExtraiteDto {
  document: Document;
  
  @IsNotEmpty()
  @IsString()
  nomChamp: string;

  @IsNotEmpty()
  @IsString()
  valeur: string;
}
