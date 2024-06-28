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
  HttpException,
  Query,
} from '@nestjs/common';
import { DocumentService } from './document.service';
import { CreateDocumentDto } from './dto/create-document.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { Document } from './entities/document.entity';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiConsumes,
  ApiBody,
  ApiParam,
  ApiQuery
} from '@nestjs/swagger';
import * as path from 'path';
import { createReadStream } from 'fs';
import { InformationsExtraitesService } from '../informations-extraites/informations-extraites.service';
import axios from 'axios';
const axiosRetry = require('axios-retry');
import * as FormData from 'form-data';
import * as fs from 'fs';
import { UpdateDocumentDto } from './dto/update-document.dto';
//import { HttpService } from '@nestjs/axios';

@ApiTags('Document')
@Controller('document')
export class DocumentController {
  constructor(
    private readonly documentService: DocumentService,
    private readonly informationsExtraitesService: InformationsExtraitesService,

    //private readonly httpService: HttpService,
  ) { }

  @Post()
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: { type: 'string', format: 'binary' },
        candidatId: { type: 'number' },
      },
    },
  })
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
  @Post('create')
 async createDocument(
  @UploadedFile() file: Express.Multer.File,
  @Body('candidatId') candidatId: number,
  @Res() response,
) {
  console.log('createDocument called with file:');
  console.log('createDocument called with candidatId:', candidatId);

  try {
    // Validate file and candidatId
    if (!file) {
      return this.sendErrorResponse(response, 'Invalid file uploaded', HttpStatus.BAD_REQUEST);
    }

    if (!candidatId) {
      return this.sendErrorResponse(response, 'Invalid candidatId provided', HttpStatus.BAD_REQUEST);
    }

    // Step 1: Upload file
    const enhancedImages = await this.uploadFile(file);
    if (!enhancedImages.length) {
      return this.sendErrorResponse(response, 'Invalid Base64 encoded images', HttpStatus.UNPROCESSABLE_ENTITY);
    }

    // Step 2: Perform OCR
    const ocrResponse = await this.performOCR(enhancedImages[0]);
    if (!ocrResponse) {
      return this.sendErrorResponse(response, 'OCR failed', HttpStatus.INTERNAL_SERVER_ERROR);
    }

    // Step 3: Classify document
    const documentType = await this.classifyDocument(ocrResponse);
    if (!documentType) {
      return this.sendErrorResponse(response, 'Document classification failed', HttpStatus.INTERNAL_SERVER_ERROR);
    }

    // Step 4: Extract data using document type
    const extractionApiUrl = `http://module_extract_data:${process.env.MODULE_EXTRACT_DATA_DOCKER_PORT}/extract`;
    let informations;

    try {
      const apiResponse = await axios.post(extractionApiUrl, {
        document_class_code: documentType,
        document_text: ocrResponse
      });

      informations = apiResponse.data;
      console.log('Extraction API response:', informations);
    } catch (error) {
      console.error('Error extracting data from document:', error);
      return this.sendErrorResponse(response, 'Document data extraction failed', HttpStatus.INTERNAL_SERVER_ERROR);
    }

    // Step 5: Check document type and save
    const existingDocuments = await this.getDocumentsByCandidatId(candidatId);
    let result;

    if (!existingDocuments.includes(documentType)) {
      console.log('Creating new document');
      result = await this.createNewDocument(file, candidatId, documentType, enhancedImages, informations);
    } else {
      console.log('Updating existing document');
      result = await this.updateExistingDocument(file, candidatId, documentType, enhancedImages);
    }

    console.log('Document processed successfully:');
    return response.status(HttpStatus.CREATED).json({
      message: 'Document processed successfully',
      status: HttpStatus.CREATED,
      result, // include any useful result data if needed
    });
  } catch (error) {
    console.error('Error creating document:', error);
    return this.sendErrorResponse(response, 'Internal server error', HttpStatus.INTERNAL_SERVER_ERROR);
  }
}


  private async uploadFile(file: Express.Multer.File): Promise<string[]> {
    const formData = new FormData();
    formData.append('file', fs.createReadStream(file.path), file.originalname);
    const apiUrl = `http://module-upload:${process.env.MODULE_UPLOAD_DOCKER_PORT}/file-to-base64`;
    const headers = formData.getHeaders();

    try {
      const response = await axios.post(apiUrl, formData, { headers });
      const images = response.data.images || [];
      return images.filter(this.isValidBase64);
    } catch (error) {
      console.error('Error uploading file:', error);
      throw new Error('File upload failed');
    }
  }

  private isValidBase64(base64Str: string): boolean {
    const base64Pattern = /^(?:[A-Za-z0-9+/]{4})*([A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/;
    return base64Pattern.test(base64Str);
  }

  private async performOCR(base64Image: string): Promise<string> {
    const language = 'fr';
    const ocrUrl = `http://module_ocr:${process.env.MODULE_OCR_DOCKER_PORT}/ocr/predict-by-base64?language=${encodeURIComponent(language)}`;
    const requestBody = { base64_str: base64Image };

    try {
      const response = await axios.post(ocrUrl, requestBody, {
        timeout: 25 * 60 * 1000,
        headers: { 'accept': 'application/json', 'Content-Type': 'application/json' }
      });
      return response.data;
    } catch (error) {
      console.error('Error performing OCR:', error);
      throw new Error('OCR processing failed');
    }
  }

  private async classifyDocument(ocrText: string): Promise<string> {
    const classificationApiUrl = `http://module_classification:${process.env.MODULE_CLASSIFICATION_DATA_DOCKER_PORT}/classify-document`;

    try {
      const response = await axios.post(classificationApiUrl, { document_text: ocrText });
      return response.data.document_type;
    } catch (error) {
      console.error('Error classifying document:', error);
      throw new Error('Document classification failed');
    }
  }

  private async createNewDocument(file: Express.Multer.File, candidatId: number, documentType: string, enhancedImages: string[], informations: any): Promise<any> {
    const createDocumentDto = new CreateDocumentDto();
    createDocumentDto.nom = file.originalname;
    createDocumentDto.type = documentType;
    createDocumentDto.file = JSON.stringify(enhancedImages);
    createDocumentDto.status = 'In Progress';
    createDocumentDto.informations = informations;

    return await this.documentService.addDocumentForUser(candidatId, createDocumentDto);
  }

  private async updateExistingDocument(file: Express.Multer.File, candidatId: number, documentType: string, enhancedImages: string[]): Promise<any> {
    const updateDocumentDto = new UpdateDocumentDto();
    updateDocumentDto.nom = file.originalname;
    updateDocumentDto.type = documentType;
    updateDocumentDto.file = JSON.stringify(enhancedImages);
    updateDocumentDto.status = 'In Progress';

    return await this.documentService.editDocumentInfos(candidatId, updateDocumentDto);
  }

  private sendErrorResponse(response, message: string, status: HttpStatus) {
    return response.status(status).json({
      message,
      status,
    });
  }

  // @Post()
  // @ApiOperation({ summary: 'Create a document' })
  // @ApiResponse({ status: HttpStatus.CREATED, description: 'Document created successfully' })
  // @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Invalid file uploaded' })
  // @ApiConsumes('multipart/form-data')
  // @ApiBody({
  //   schema: {
  //     type: 'object',
  //     properties: {
  //       file: { type: 'string', format: 'binary' },
  //       candidatId: { type: 'number' },
  //     },
  //   },
  // })
  // @UseInterceptors(
  //   FileInterceptor('file', {
  //     storage: diskStorage({
  //       destination: './uploads/docs',
  //       filename: (req, file, cb) => {
  //         cb(null, `${file.originalname}`);
  //       },
  //     }),
  //   }),
  // )

  // async createDocument(
  //   @UploadedFile() file: Express.Multer.File,
  //   @Body('candidatId') candidatId: number,
  //   @Res() response,
  // ) {
  //   console.log('createDocument called with file:');
  //   console.log('createDocument called with candidatId:');

  //   try {
  //     if (!file || !file.filename || file == null) {
  //       console.log('Invalid file uploaded');
  //       return response.status(HttpStatus.BAD_REQUEST).json({
  //         message: 'Invalid file uploaded',
  //         status: HttpStatus.BAD_REQUEST,
  //       });
  //     }

  //     const FormData = require('form-data');
  //     const formData = new FormData();
  //     formData.append('file', createReadStream(file.path), file.originalname);
  //     const apiUrl = `http://module-upload:${process.env.MODULE_UPLOAD_DOCKER_PORT}`;
  //     const headers = formData.getHeaders();
  //     console.log('Sending POST request to:', apiUrl + '/file-to-base64');
  //     const responseFromUpload = await axios.post(apiUrl + '/file-to-base64', formData, { headers });
  //     console.log('Response from upload:');    

  //     // Step 1: Enhance the image
  //      console.log('Enhancing image');
  //      let enhancedImages;
  //      try {
  //       const enhanceApiUrl = `http://module_image_enhancement:${process.env.MODULE_IMAGE_DOCKER_PORT}`;
  //       const enhancedImageResponses = await Promise.all(
  //          responseFromUpload.data.images.map(async (base64Image) => {
  //            const enhanceResponse = await axios.post(`${enhanceApiUrl}/enhance/base64`, { image: base64Image });
  //            return enhanceResponse.data.image;
  //          })
  //        );
  //        enhancedImages = enhancedImageResponses;
  //        console.log('Enhanced images received');
  //      } catch (enhanceError) {
  //        console.error('Error during image enhancement:', enhanceError);
  //        return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
  //          message: 'Failed to enhance image',
  //         status: HttpStatus.INTERNAL_SERVER_ERROR,
  //        });
  //      }

  //     console.log('Validating enhanced images');
  //     const isValidBase64 = (base64Str) => {
  //       const base64Pattern = /^(?:[A-Za-z0-9+/]{4})*([A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/;
  //       return base64Pattern.test(base64Str);
  //     };

  //     const invalidImages = enhancedImages.filter(image => !isValidBase64(image));
  //     if (invalidImages.length > 0) {
  //       console.error('Invalid Base64 images found:', invalidImages);
  //       return response.status(HttpStatus.UNPROCESSABLE_ENTITY).json({
  //         message: 'Invalid Base64 encoded images',
  //         status: HttpStatus.UNPROCESSABLE_ENTITY,
  //       });
  //     }
  //     console.log('All enhanced images are valid Base64');

  //     console.log('Recognizing text');

  //     const language = 'fr';
  //     const encodedLanguage = encodeURIComponent(language);
  //     const endpointUrl = `http://module_ocr:${process.env.MODULE_OCR_DOCKER_PORT}/ocr/predict-by-base64?language=${encodedLanguage}`;
  //     const requestBody = {
  //       base64_str: enhancedImages[0],
  //     };

  //     const timeout = 25 * 60 * 1000; // 25 minutes in milliseconds
  //     const axiosConfig = {
  //       timeout: timeout,
  //       headers: {
  //         'accept': 'application/json',
  //         'Content-Type': 'application/json'
  //       }
  //     };

  //     const ocrResponse = await axios.post(endpointUrl, requestBody, axiosConfig);
  //     console.log('OCR Response:', ocrResponse.data);

  //     // Step 4: Document Classification
  //     console.log('Classifying document');
  //     let documentType;
  //     try {
  //       const classificationApiUrl = `http://module_classification:${process.env.MODULE_CLASSIFICATION_DATA_DOCKER_PORT}`;
  //       const classifyResponse = await axios.post(`${classificationApiUrl}/classify-document`, { document_text: ocrResponse.data });
  //       documentType = classifyResponse.data.document_type;
  //       console.log('Document classified as:', documentType);
  //     } catch (classificationError) {
  //       console.error('Error during document classification:', classificationError);
  //       return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
  //         message: 'Failed to classify document',
  //         status: HttpStatus.INTERNAL_SERVER_ERROR,
  //       });
  //     }

  //     // Step 5: Document Saving
  //     const createDocumentDto = new CreateDocumentDto();
  //     createDocumentDto.nom = file.originalname;
  //     createDocumentDto.type = documentType;
  //     createDocumentDto.file = JSON.stringify(enhancedImages);
  //     createDocumentDto.status = 'In Progress';

  //     const newDocument = await this.documentService.addDocumentForUser(candidatId, createDocumentDto);

  //     return response.status(HttpStatus.CREATED).json({
  //       message: 'Document created successfully',
  //       status: HttpStatus.CREATED,
  //     });
  //   } catch(error) {
  //     console.error('Error creating document:', error);
  //     return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
  //       message: 'Internal server error',
  //       status: HttpStatus.INTERNAL_SERVER_ERROR,
  //     });
  //   }
  // }




  @Get('Candidat/:candidatId')
  @ApiOperation({ summary: 'Get all documents for a candidate' })
  @ApiParam({
    name: 'candidatId',
    description: 'Candidat ID',
    type: 'number',
  })
  async getDocumentsByCandidatId(@Param('candidatId') candidatId: number) {
    try {
      return await this.documentService.getDocumentsByCandidatId(candidatId);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException(error.message);
      }
      throw error;
    }
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
  @Get('details/:id')
  @ApiOperation({ summary: 'Get document details by candidate ID' })
  @ApiParam({ name: 'id', type: 'number', description: 'The ID of the candidate' })
  @ApiQuery({ name: 'filterName', type: 'string', required: false, description: 'Filter documents by name' })
  @ApiResponse({ status: 200, description: 'Return document details', type: [Document] })
  async getDocumentsDetailsByCandidatId(
    @Param('id') id: number,
    @Query('filterKey') filterName: string, // Optional query parameter
  ) {
    console.log("filterName: ", filterName);
    const response = await this.documentService.getDocumentsDetailsByCandidatId(id, filterName);
    //console.log(response);
    return response;
  }

  @Post('interview/:candidatID')
  async getResponse(
    @Param('candidatID') candidatID: number,
    @Body('interviewText') interviewText: string
  ) {
    const response = await this.extractSkills(interviewText);
    // Transformation of the response
    const transformedResponse = {
      ...response,
      ...response.filtered_skills ? Object.keys(response.filtered_skills).reduce((acc, key) => {
        const skills = response.filtered_skills[key].map((skill, index) => ({
          [`doc_node_value-${key}-${index + 1}`]: skill.doc_node_value,
          [`score-${key}-${index + 1}`]: skill.score,
          [`skill_name-${key}-${index + 1}`]: skill.skill_name,
          [`skill_type-${key}-${index + 1}`]: skill.skill_type
        }));
        return { ...acc, ...Object.assign({}, ...skills) };
      }, {}) : {},
      global_score_percentage: response.global_score_percentage
    };

    // Add Soft Skills directly at the same level
    if (response.filtered_skills && response.filtered_skills["Soft Skill"]) {
      const softSkills = response.filtered_skills["Soft Skill"].map((skill, index) => ({
        [`doc_node_value-Soft-${index + 1}`]: skill.doc_node_value,
        [`score-Soft-${index + 1}`]: skill.score,
        [`skill_name-Soft-${index + 1}`]: skill.skill_name,
        [`skill_type-Soft-${index + 1}`]: skill.skill_type
      }));
      Object.assign(transformedResponse, ...softSkills);
    }

    const createDocumentDto = new CreateDocumentDto();
    createDocumentDto.nom = "INTERVIEW";
    createDocumentDto.type = 'INTER';
    createDocumentDto.dateTelechargement = new Date();
    createDocumentDto.file = '*********';
    createDocumentDto.status = 'DONE';
    const newDocument = await this.documentService.addDocumentForUser(candidatID, createDocumentDto);
    const final_response = await this.documentService.saveExtractedInformation(newDocument.id, transformedResponse);

    return final_response;
  }

  async extractSkills(text: string) {
    if (!process.env.MODULE_STT_DOCKER_PORT) {
      throw new HttpException('MODULE_STT_DOCKER_PORT environment variable is not defined.', HttpStatus.INTERNAL_SERVER_ERROR);
    }

    const port = process.env.MODULE_STT_DOCKER_PORT;
    const headers = { 'Content-Type': 'application/json' };
    try {
      const responseFromSTT = await axios.post(`http://module-stt:${port}/extract_skills`, { text }, { headers });
      return responseFromSTT.data;
    } catch (error) {
      console.error('Error:', error.message);
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get('interviews/:candidatID')
  async getAllInterviewsByCandidatId(@Param('candidatId') candidatId: number) {
    try {
      return await this.documentService.getInterviewsByCandidatId(candidatId);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException(error.message);
      }
      throw error;
    }
  }

  @Post('request/:candidatId')
  async addDocumentsRequest(
    @Param('candidatId') candidatId: number,
    @Body() addDocuments: any, // Adjust type as per your schema
  ): Promise<any> {
    try {
      const response = await this.documentService.addDocumentsRequest(candidatId, addDocuments);
      return response;
    } catch (error) {
      console.error('An error occurred:', error);
      throw error;
    }
  }


}
