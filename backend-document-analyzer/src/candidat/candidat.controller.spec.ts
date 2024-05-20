import { Test, TestingModule } from '@nestjs/testing';
import { CandidatController } from './candidat.controller';
import { CandidatService } from './candidat.service';
import { CreateCandidatDto } from './dto/create-candidat.dto';
import { UpdateCandidatDto } from './dto/update-candidat.dto';
import { Candidat } from './entities/candidat.entity';
import { NotFoundException } from '@nestjs/common';
import { HttpStatus } from '@nestjs/common';


describe('CandidatController', () => {
  let controller: CandidatController;
  let service: CandidatService;

  const mockCandidatService = {
    createCandidat: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
    search: jest.fn(),     
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CandidatController],
      providers: [CandidatService],
    })
      .overrideProvider(CandidatService)
      .useValue(mockCandidatService)
      .compile();

    controller = module.get<CandidatController>(CandidatController);
    service = module.get<CandidatService>(CandidatService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('#createCandidat', () => {
    it('should call service.createCandidat and return the created candidat', async () => {
      const createCandidatDto: CreateCandidatDto = {
        full_name: 'John Doe',
        email: 'john@example.com',
        documents: [],
      };
      const createdCandidat: Candidat = {
        id_candidat: 1,
        full_name: 'John Doe',
        email: 'john@example.com',
        docs: [],
      };
      mockCandidatService.createCandidat.mockResolvedValue(createdCandidat);

      const mockResponse = {
        status: jest.fn().mockReturnValue({ json: jest.fn() }),
      };

      const response = await controller.createCandidat(createCandidatDto, mockResponse);

      expect(mockCandidatService.createCandidat).toHaveBeenCalledWith(
        createCandidatDto,
      );

      expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.CREATED);
      expect(mockResponse.status().json).toHaveBeenCalledWith({
        message: 'Candidat created successfully',
        data: createdCandidat,
      });
    });


    it('should return internal server error if service throws an error', async () => {
      const createCandidatDto: CreateCandidatDto = {
        full_name: 'John Doe',
        email: 'john@example.com',
        documents: [],
      };
      const errorMessage = 'Failed to create candidat';
      mockCandidatService.createCandidat.mockRejectedValue(new Error(errorMessage));

      const mockResponse = {
        status: jest.fn().mockReturnValue({ json: jest.fn() }),
      };

      const response = await controller.createCandidat(createCandidatDto, mockResponse);

      expect(response).toEqual(undefined); // As we don't have a return value
      expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.INTERNAL_SERVER_ERROR);
      expect(mockResponse.status().json).toHaveBeenCalledWith({
        message: errorMessage,
        error: errorMessage, // Assuming you want to return the error message
        data: null,
      });
    });

  });

  describe('#findAll', () => {
    it('should return all candidats', async () => {
      const candidats: Candidat[] = [
        { id_candidat: 1, full_name: 'John Doe', email: 'john@example.com', docs: [] },
        { id_candidat: 2, full_name: 'Jane Doe', email: 'jane@example.com', docs: [] },
      ];
      mockCandidatService.findAll.mockResolvedValue(candidats);

      const mockResponse = {
        status: jest.fn().mockReturnValue({ json: jest.fn() }),
      };

      const response = await controller.findAll(mockResponse);

      expect(mockCandidatService.findAll).toHaveBeenCalled();
      expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.OK);
      expect(mockResponse.status().json).toHaveBeenCalledWith(candidats);
    });

    it('should return internal server error if service throws an error', async () => {
      const errorMessage = 'Failed to fetch all candidates';
      mockCandidatService.findAll.mockRejectedValue(new Error(errorMessage));

      const mockResponse = {
        status: jest.fn().mockReturnValue({ json: jest.fn() }),
      };

      const response = await controller.findAll(mockResponse);

      expect(response).toEqual(undefined);
      expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.INTERNAL_SERVER_ERROR);
      expect(mockResponse.status().json).toHaveBeenCalledWith({
        message: errorMessage,
        error: errorMessage,
      });
    });
  });

 describe('#findOne', () => {
    it('should return a specific candidat', async () => {
      const id = 1;
      const candidat: Candidat = {
        id_candidat: id,
        full_name: 'John Doe',
        email: 'john@example.com',
        docs: [],
      };
      mockCandidatService.findOne.mockResolvedValue(candidat);

      const mockResponse = {
        status: jest.fn().mockReturnValue({ json: jest.fn() }),
      };

      const response = await controller.findOne(id, mockResponse);

      expect(mockCandidatService.findOne).toHaveBeenCalledWith({ where: { id_candidat: id } });
      expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.OK);
      expect(mockResponse.status().json).toHaveBeenCalledWith(candidat);
    });

    it('should return internal server error if service throws an error', async () => {
      const id = 1;
      const errorMessage = 'Failed to fetch candidate';
      mockCandidatService.findOne.mockRejectedValue(new Error(errorMessage));

      const mockResponse = {
        status: jest.fn().mockReturnValue({ json: jest.fn() }),
      };

      const response = await controller.findOne(id, mockResponse);

      expect(response).toEqual(undefined);
      expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.INTERNAL_SERVER_ERROR);
      expect(mockResponse.status().json).toHaveBeenCalledWith({
        message: errorMessage,
        error: errorMessage,
      });
    });
  });

  describe('#update', () => {
    it('should update a specific candidat', async () => {
      const id = 1;
      const updateCandidatDto: UpdateCandidatDto = {
        full_name: 'Updated Name',
        email: 'updated@example.com',
        documents: [],
      };

      const mockResponse = {
        status: jest.fn().mockReturnValue({ json: jest.fn() }),
      };

      await controller.update(id, updateCandidatDto, mockResponse);

      expect(mockCandidatService.update).toHaveBeenCalledWith(
        { where: { id_candidat: id } },
        updateCandidatDto,
      );
      expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.OK);
      expect(mockResponse.status().json).toHaveBeenCalledWith({
        message: `Candidat with ID ${id} updated successfully`,
      });
    });

    it('should return internal server error if service throws an error', async () => {
      const id = 1;
      const updateCandidatDto: UpdateCandidatDto = {
        full_name: 'Updated Name',
        email: 'updated@example.com',
        documents: [],
      };
      const errorMessage = 'Failed to update candidat';
      mockCandidatService.update.mockRejectedValue(new Error(errorMessage));

      const mockResponse = {
        status: jest.fn().mockReturnValue({ json: jest.fn() }),
      };

      const response = await controller.update(id, updateCandidatDto, mockResponse);

      expect(response).toEqual(undefined);
      expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.INTERNAL_SERVER_ERROR);
      expect(mockResponse.status().json).toHaveBeenCalledWith({
        message: errorMessage,
        error: errorMessage,
      });
    });
  });

  describe('#remove', () => {
    it('should remove a specific candidat', async () => {
      const id = 1;

      const mockResponse = {
        status: jest.fn().mockReturnValue({ json: jest.fn() }),
      };

      await controller.remove(id, mockResponse);

      expect(mockCandidatService.remove).toHaveBeenCalledWith({ where: { id_candidat: id } });
      expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.OK);
      expect(mockResponse.status().json).toHaveBeenCalledWith({
        message: `Candidat with ID ${id} removed successfully`,
      });
    });

    it('should return internal server error if service throws an error', async () => {
      const id = 1;
      const errorMessage = 'Failed to remove candidat';
      mockCandidatService.remove.mockRejectedValue(new Error(errorMessage));

      const mockResponse = {
        status: jest.fn().mockReturnValue({ json: jest.fn() }),
      };

      const response = await controller.remove(id, mockResponse);

      expect(response).toEqual(undefined);
      expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.INTERNAL_SERVER_ERROR);
      expect(mockResponse.status().json).toHaveBeenCalledWith({
        message: errorMessage,
        error: errorMessage,
      });
    });
  });

  describe('#searchCandidats', () => {
    it('should search candidats', async () => {
      const query = 'John Doe'; // Directly provide the query as a string
      const candidats: Candidat[] = [
        { id_candidat: 1, full_name: 'John Doe', email: 'john@example.com', docs: [] },
        { id_candidat: 2, full_name: 'Jane Doe', email: 'jane@example.com', docs: [] },
      ];
      mockCandidatService.search.mockResolvedValue(candidats);

      const mockResponse = {
        status: jest.fn().mockReturnValue({ json: jest.fn() }),
      };

      const response = await controller.searchCandidats(query, mockResponse); // Pass the query directly

      expect(mockCandidatService.search).toHaveBeenCalledWith(query);
      expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.OK);
      expect(mockResponse.status().json).toHaveBeenCalledWith(candidats);
    });

    it('should return internal server error if service throws an error', async () => {
      const query = 'John Doe'; // Directly provide the query as a string
      const errorMessage = 'Failed to search candidats';
      mockCandidatService.search.mockRejectedValue(new Error(errorMessage));

      const mockResponse = {
        status: jest.fn().mockReturnValue({ json: jest.fn() }),
      };

      const response = await controller.searchCandidats(query, mockResponse); // Pass the query directly

      expect(response).toEqual(undefined);
      expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.INTERNAL_SERVER_ERROR);
      expect(mockResponse.status().json).toHaveBeenCalledWith({
        message: errorMessage,
        error: errorMessage,
      });
    });
  });
});
