import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseInterceptors,
  UploadedFile,
  HttpStatus,
  Res,
  NotFoundException,
  StreamableFile,
} from '@nestjs/common';
import { DocumentService } from './document.service';
import { CreateDocumentDto } from './dto/create-document.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiConsumes,
  ApiBody,
  ApiParam,
} from '@nestjs/swagger';
import * as path from 'path';
import { createReadStream } from 'fs';
import { InformationsExtraitesService } from 'src/informations-extraites/informations-extraites.service';
import axios from 'axios';
import { HttpService } from '@nestjs/axios';

@ApiTags('Document')
@Controller('document')
export class DocumentController {
  constructor(
    private readonly documentService: DocumentService,
    private readonly informationsExtraitesService: InformationsExtraitesService,
    private readonly httpService: HttpService,
  ) {}

  @Post()
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads/docs',
        filename: (req, file, cb) => {
          cb(null, `${file.originalname}`);
        },
      }),
    }),
  )
  async createDocument(
    @UploadedFile() file: Express.Multer.File,
    @Body('candidatId') candidatId: number,
    @Res() response,
  ) {
    try {
      if (!file || !file.filename) {
        return response.status(HttpStatus.BAD_REQUEST).json({
          message: 'Invalid file uploaded',
          status: HttpStatus.BAD_REQUEST,
        });
      }      
      let FormData = require('form-data');
      const formData = new FormData();
      formData.append('file', createReadStream(file.path), file.originalname);      
      const apiUrl = process.env.URL_MODULE_DOWNLOAD;
      const headers = formData.getHeaders();
      const responseFromFlask = await axios.post(apiUrl, formData, { headers });      
      const createDocumentDto = new CreateDocumentDto();

      createDocumentDto.nom = file.originalname;
      createDocumentDto.type = 'document';
      createDocumentDto.file = responseFromFlask.data;
      createDocumentDto.status = 'Status';
      const newDocument = await this.documentService.addDocumentForUser(
        candidatId,
        createDocumentDto,
      );

      return response.status(HttpStatus.CREATED).json({
        message: 'Document created successfully',
        status: HttpStatus.CREATED,        
      });
    } catch (error) {
      console.error('Error creating document:', error);
      return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: 'Internal server error',
        status: HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }
  }

  @Get('file/folder/:folder/:img')
  @ApiOperation({ summary: 'Read a file' })
  @ApiParam({
    name: 'folder',
    description: 'Folder containing the file',
    type: 'string',
  })
  @ApiParam({
    name: 'img',
    description: 'Image file',
    type: 'string',
  })
  readFile(
    @Param('folder') folder: string,
    @Param('img') img: string,
  ): StreamableFile {
    const file = createReadStream(path.join(process.cwd(), '', folder, img));
    return new StreamableFile(file);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Find a document by ID' })
  @ApiParam({
    name: 'id',
    description: 'Document ID',
    type: 'number',
  })
  async findById(@Param('id') id: number) {
    try {
      return await this.documentService.findById(id);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException(error.message);
      }
      throw error;
    }
  }

  @Post(':userId')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        userId: { type: 'number' },
        createDocumentDto: {
          type: 'object',
          properties: {
            nom: { type: 'string' },
            type: { type: 'string' },
            date_telechargement: { type: 'string', format: 'date-time' },
            file: { type: 'string', format: 'binary' },
            status: { type: 'string' },
            informationsExtraite: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  nomChamp: { type: 'string' },
                  valeur: { type: 'string' },
                },
              },
            },
          },
        },
      },
    },
  })
  @ApiOperation({ summary: 'Add a document for a user' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Document added successfully',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'User not found',
  })
  async addDocumentForUser(
    @Body('userId') userId: number,
    @Body('createDocumentDto') createDocumentDto: CreateDocumentDto,
    @Res() response,
  ) {
    try {
      const document = await this.documentService.addDocumentForUser(
        userId,
        createDocumentDto,
      );

      // Check if extracted information is provided in the request body
      if (createDocumentDto.informations) {
        const informationsExtraiteDtoArray = createDocumentDto.informations;
        // Iterate over each informationsExtraiteDto and add it individually
        for (const informationsExtraiteDto of informationsExtraiteDtoArray) {
          await this.informationsExtraitesService.addInformationsExtraiteForDocument(
            informationsExtraiteDto,
            document,
          );
        }
      }

      return response.status(HttpStatus.CREATED).json({
        message: 'Document added successfully',
        status: HttpStatus.CREATED,
        document: document,
      });
    } catch (error) {
      return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: 'Internal server error',
        status: HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }
  }
}
