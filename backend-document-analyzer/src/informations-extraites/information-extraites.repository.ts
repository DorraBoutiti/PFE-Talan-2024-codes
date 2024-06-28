import { Injectable } from '@nestjs/common';
import { EntityRepository, Repository } from 'typeorm';
import { InformationExtraites } from './entities/informations-extraite.entity';

@EntityRepository(InformationExtraites)
@Injectable() // Add this decorator
export class InformationExtraitesRepository extends Repository<InformationExtraites> {}
