import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { InformationsExtraitesService } from './informations-extraites.service';
import { CreateInformationsExtraiteDto } from './dto/create-informations-extraite.dto';
import { UpdateInformationsExtraiteDto } from './dto/update-informations-extraite.dto';
import { ApiTags, ApiResponse, ApiOperation, ApiParam } from '@nestjs/swagger';

@ApiTags('Informations-Extraites')
@Controller('informations-extraites')
export class InformationsExtraitesController {
  constructor(
    private readonly informationsExtraitesService: InformationsExtraitesService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create new information extraite' })
  @ApiResponse({
    status: 201,
    description: 'The information extraite has been successfully created.',
  })
  async create(
    @Body() createInformationsExtraiteDto: CreateInformationsExtraiteDto,
  ) {
    // return this.informationsExtraitesService.create(
    //   createInformationsExtraiteDto,
    // );
  }

  @Get(':idDocument')
  @ApiOperation({ summary: 'Find all information extraite by document ID' })
  @ApiParam({ name: 'idDocument', description: 'Document ID', type: 'number' })
  async findAllByDocumentId(@Param('idDocument') idDocument: number) {
    //return this.informationsExtraitesService.findAllByDocumentId(idDocument);
  }

  @Get()
  @ApiOperation({ summary: 'Find all information extraites' })
  async findAll() {
    //return this.informationsExtraitesService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Find an information extraite by ID' })
  @ApiParam({
    name: 'id',
    description: 'Information extraite ID',
    type: 'string',
  })
  async findOne(@Param('id') id: string) {
    //return this.informationsExtraitesService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update an information extraite' })
  @ApiParam({
    name: 'id',
    description: 'Information extraite ID',
    type: 'string',
  })
  update(
    @Param('id') id: string,
    @Body() updateInformationsExtraiteDto: UpdateInformationsExtraiteDto,
  ) {
    // return this.informationsExtraitesService.update(
    //   +id,
    //   updateInformationsExtraiteDto,
    // );
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete an information extraite' })
  @ApiParam({
    name: 'id',
    description: 'Information extraite ID',
    type: 'string',
  })
  remove(@Param('id') id: string) {
    //return this.informationsExtraitesService.remove(+id);
  }
  // @Post(':documentId')
  // @ApiOperation({ summary: 'Add informations extraite for a document' })
  // @ApiParam({ name: 'documentId', description: 'Document ID', type: 'number' })
  // @ApiResponse({ status: 201, description: 'Informations extraite added successfully.' })
  // async addInformationsExtraiteForDocument(
  //   @Param('documentId') documentId: number,
  //   @Body() createInformationsExtraiteDto: CreateInformationsExtraiteDto,
  // ): Promise<InformationExtraites> {
  //   try {
  //     return await this.informationsExtraitesService.addInformationsExtraiteForDocument(createInformationsExtraiteDto);
  //   } catch (error) {
  //     throw new NotFoundException(error.message);
  //   }
  // }
}
