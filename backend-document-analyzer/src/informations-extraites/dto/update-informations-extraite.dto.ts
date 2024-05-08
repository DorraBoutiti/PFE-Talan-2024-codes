import { PartialType } from '@nestjs/mapped-types';
import { CreateInformationsExtraiteDto } from './create-informations-extraite.dto';

export class UpdateInformationsExtraiteDto extends PartialType(CreateInformationsExtraiteDto) {}
