import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Res,
  HttpStatus,
  Query,
} from '@nestjs/common';
import { CandidatService } from './candidat.service';
import { CreateCandidatDto } from './dto/create-candidat.dto';
import { UpdateCandidatDto } from './dto/update-candidat.dto';
import { FindOneOptions } from 'typeorm';
import { Candidat } from './entities/candidat.entity';
import {
  ApiTags,
  ApiResponse,
  ApiBadRequestResponse,
  ApiInternalServerErrorResponse,
  ApiBody,
} from '@nestjs/swagger';

@Controller('candidat')
@ApiTags('Candidats')
export class CandidatController {
  constructor(private readonly candidatService: CandidatService) {}

  @Post()
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'The candidat has been successfully created.',
  })
  @ApiBadRequestResponse({ description: 'Failed to create candidat.' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error.' })
  async createCandidat(
    @Body() createCandidatDto: CreateCandidatDto,
    @Res() response,
  ) {
    try {
      const candidat =
        await this.candidatService.createCandidat(createCandidatDto);
      return response.status(HttpStatus.CREATED).json({
        message: 'Candidat created successfully',
        data: candidat,
      });
    } catch (error) {
      return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: 'Failed to create candidat',
        error: error.message,
        data: null,
      });
    }
  }
  
  @Get('/all')
  @ApiResponse({ status: HttpStatus.OK, description: 'Returns all candidats.' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error.' })
  async findAll(@Res() response) {
    try {
      const candidats = await this.candidatService.findAll();
      return response.status(HttpStatus.OK).json(candidats);
    } catch (error) {
      return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: 'Failed to fetch all candidates',
        error: error.message,
      });
    }
  }

  @Get(':id')
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Returns a specific candidat.',
  })
  @ApiInternalServerErrorResponse({ description: 'Internal server error.' })
  async findOne(@Param('id') id: number, @Res() response): Promise<void> {
    const option: FindOneOptions<Candidat> = { where: { id_candidat: id } };
    try {
      const candidat = await this.candidatService.findOne(option);
      response.status(HttpStatus.OK).json(candidat);
    } catch (error) {
      response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: 'Failed to fetch candidate',
        error: error.message,
      });
    }
  }

  @Patch(':id')
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The candidat has been successfully updated.',
  })
  @ApiBadRequestResponse({ description: 'Failed to update candidat.' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error.' })
  async update(
    @Param('id') id: number,
    @Body() updateCandidatDto: UpdateCandidatDto,
    @Res() response,
  ) {
    const option: FindOneOptions<Candidat> = { where: { id_candidat: id } };
    try {
      await this.candidatService.update(option, updateCandidatDto);
      return response.status(HttpStatus.OK).json({
        message: `Candidat with ID ${id} updated successfully`,
      });
    } catch (error) {
      return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: 'Failed to update candidat',
        error: error.message,
      });
    }
  }

  @Delete(':id')
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The candidat has been successfully removed.',
  })
  @ApiBadRequestResponse({ description: 'Failed to remove candidat.' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error.' })
  async remove(@Param('id') id: number, @Res() response) {
    const option: FindOneOptions<Candidat> = { where: { id_candidat: id } };
    try {
      await this.candidatService.remove(option);
      return response.status(HttpStatus.OK).json({
        message: `Candidat with ID ${id} removed successfully`,
      });
    } catch (error) {
      return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: 'Failed to remove candidat',
        error: error.message,
      });
    }
  }

  @Post('search')
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Returns candidats matching the search query.',
  })
  @ApiBadRequestResponse({ description: 'Failed to search candidats.' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error.' })
  @ApiBody({ 
    description: 'query',
    schema: {
      type: 'object',
      properties: {
        query: {
          type: 'string',
          description: 'The search query for candidats',
          example: 'John Doe',
        },
      },
    },
  })
  async searchCandidats(@Body('query') query: string, @Res() response) {
    try {
      const candidats = await this.candidatService.search(query);      
      return response.status(HttpStatus.OK).json(candidats);
    } catch (error) {
      return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: 'Failed to search candidats',
        error: error.message,
      });
    }
  }
}
