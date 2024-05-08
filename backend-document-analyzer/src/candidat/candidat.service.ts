import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCandidatDto } from './dto/create-candidat.dto';
import { UpdateCandidatDto } from './dto/update-candidat.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOneOptions, Repository, ILike, Like } from 'typeorm';
import { Candidat } from './entities/candidat.entity';
import { MailService } from 'src/mail/mail.service';

@Injectable()
export class CandidatService {
  constructor(
    @InjectRepository(Candidat)
    private candidatRepository: Repository<Candidat>,
    private readonly mailService: MailService,
  ) {}
  async createCandidat(
    createCandidatDto: CreateCandidatDto,
  ): Promise<Candidat> {
    const candidat = new Candidat();
    candidat.full_name = createCandidatDto.full_name;
    candidat.email = createCandidatDto.email;
    // Save the new candidat to the database
    const new_candidat = await this.candidatRepository.save(candidat);
    this.mailService.sendUserConfirmation(new_candidat.full_name, new_candidat.email, new_candidat.id_candidat);

    // Save the new candidat to the database
    return await this.candidatRepository.save(candidat);
  }
  async findAll(): Promise<Candidat[]> {
    try {
      return await this.candidatRepository.find();
    } catch (error) {
      throw new Error(`Failed to fetch all candidates: ${error.message}`);
    }
  }

  async findOne(option: FindOneOptions<Candidat>): Promise<Candidat> {
    const candidat = await this.candidatRepository.findOne(option);
    if (!candidat) {
      throw new NotFoundException(`Candidat with ID ${option} not found`);
    }
    return candidat;

    //return `This action returns a #${id} candidat`;
  }

  async update(
    option: FindOneOptions<Candidat>,
    updateCandidatDto: UpdateCandidatDto,
  ): Promise<Candidat> {
    const candidat = await this.candidatRepository.findOne(option);
    if (!candidat) {
      throw new NotFoundException(`Candidat with ID ${option} not found`);
    }
    Object.assign(candidat, updateCandidatDto);

    return await this.candidatRepository.save(candidat);
  }

  async remove(option: FindOneOptions<Candidat>): Promise<void> {
    const candidat = await this.candidatRepository.findOne(option);
    if (!candidat) {
      throw new NotFoundException(`Candidat with ID ${option} not found`);
    }
    await this.candidatRepository.remove(candidat);
  }

  async search(query: string): Promise<Candidat[]> {
    try {
      return await this.candidatRepository.find({
        where: [
          { full_name: ILike(`%${query}%`) }, 
          { email: ILike(`%${query}%`) },
        ],
      });
    } catch (error) {
      throw new Error(`Failed to search candidats: ${error.message}`);
    }
  }
  
}
