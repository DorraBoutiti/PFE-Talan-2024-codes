import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsString, IsEmail, IsOptional, IsArray, ValidateNested } from 'class-validator';
import { CreateDocumentDto } from 'src/document/dto/create-document.dto';

export class CreateCandidatDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  full_name: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  email: string;

  @ValidateNested()
  @IsArray()
  @Type(() => CreateDocumentDto)
  @IsOptional()
  docs: CreateDocumentDto[];
}
