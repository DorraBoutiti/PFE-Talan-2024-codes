import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCandidatDto } from './dto/create-candidat.dto';
import { UpdateCandidatDto } from './dto/update-candidat.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOneOptions, Repository, ILike, Like } from 'typeorm';
import { Candidat } from './entities/candidat.entity';
import { MailService } from '../mail/mail.service';
import { Document } from './../document/entities/document.entity';


@Injectable()
export class CandidatService {
  constructor(
    @InjectRepository(Candidat)
    private candidatRepository: Repository<Candidat>,
    private readonly mailService: MailService,
    @InjectRepository(Document)
    private readonly documentRepository: Repository<Document>,
  ) { }

  /**
   * Create a new candidat with the provided data, save it to the database, save associated documents,
   * and send a confirmation email.
   *
   * @param {CreateCandidatDto} createCandidatDto - Data to create the new candidat
   * @return {Promise<Candidat>} The newly created candidat
   */
  async createCandidat(createCandidatDto: CreateCandidatDto): Promise<Candidat> {
    const { full_name, email, documents } = createCandidatDto;

    if (!full_name || !email || !Array.isArray(documents)) {
      throw new Error('Invalid input data. "full_name", "email", and "documents" are required.');
    }

    // Create a new candidat entity
    const candidat = this.candidatRepository.create({
      full_name,
      email,
    });

    // Save the new candidat to the database
    const newCandidat = await this.candidatRepository.save(candidat);

    // Map each document to a promise of saving it
    const documentPromises = documents.map(async (element) => {
      const newDocument = this.documentRepository.create({
        type: element,
        status: 'Pending',
        nom: '',
        file: "It's a file 1235cddfdddfvdfrfv",
        dateTelechargement: new Date(),
        candidat: newCandidat,
      });

      // Save the document and return the saved document
      return await this.documentRepository.save(newDocument);
    });

    // Wait for all documents to be saved
    await Promise.all(documentPromises);

    // Send confirmation email
    this.mailService.sendUserConfirmation(newCandidat.full_name, newCandidat.email, newCandidat.id_candidat);

    return newCandidat;
  }


  /**
   * Retrieve all candidates.
   *
   * @return {Promise<Candidat[]>} List of all candidates
   */
  async findAll(): Promise<Candidat[]> {
    try {
      return await this.candidatRepository.find();
    } catch (error) {
      throw new Error(`Failed to fetch all candidates: ${error.message}`);
    }
  }

  /**
   * A description of the entire function.
   *
   * @param {FindOneOptions<Candidat>} option - The options to find a Candidat
   * @return {Promise<Candidat>} The found Candidat
   */
  async findOne(option: FindOneOptions<Candidat>): Promise<Candidat> {
    const candidat = await this.candidatRepository.findOne(option);
    if (!candidat) {
      throw new NotFoundException(`Candidat with ID ${option} not found`);
    }
    return candidat;

    //return `This action returns a #${id} candidat`;
  }

  /**
   * A description of the entire function.
   *
   * @param {FindOneOptions<Candidat>} option - The options to find a Candidat
   * @param {UpdateCandidatDto} updateCandidatDto - Data to update the Candidat
   * @return {Promise<Candidat>} The updated Candidat
   */
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

  /**
   * A description of the entire function.
   *
   * @param {FindOneOptions<Candidat>} option - The options to find a Candidat
   * @return {Promise<void>} 
   */
  async remove(option: FindOneOptions<Candidat>): Promise<void> {
    const candidat = await this.candidatRepository.findOne(option);
    if (!candidat) {
      throw new NotFoundException(`Candidat with ID ${option} not found`);
    }
    await this.candidatRepository.remove(candidat);
  }

  /**
   * A description of the entire function.
   *
   * @param {string} query - The query string used for searching candidats
   * @return {Promise<{ id_candidat: number; full_name: string }[]>} A promise that resolves to an array of objects containing id and full name of candidats
   */
  async search(query: string): Promise<{ id_candidat: number; full_name: string }[]> {
    try {
      const candidats = await this.candidatRepository.find({
        select: ["id_candidat", "full_name"],
        where: [
          { full_name: ILike(`%${query}%`) },
          { email: ILike(`%${query}%`) },
        ],
      });
      return candidats.map(({ id_candidat, full_name }) => ({ id_candidat, full_name }));
    } catch (error) {
      throw new Error(`Failed to search candidats: ${error.message}`);
    }
  }


}
