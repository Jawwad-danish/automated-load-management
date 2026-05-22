import { Test, TestingModule } from '@nestjs/testing';
import { CommandRunner, QueryRunner } from '@module-cqrs';
import { DriverService } from './driver.service';
import { DriverEntity } from '../../persistence';
import { GetDriverQuery } from './queries/get-driver.query';
import { FindDriversQuery } from './queries/find-drivers.query';
import { EntityNotFoundError } from '@core/errors';
import {
  PageCriteria,
  PageResult,
  PaginationResult,
  QueryCriteria,
} from '@core/data';
import { mockToken } from '@core/test';
import { CreateDriverRequest, UpdateDriverRequest } from '../data';
import { CreateDriverCommand, UpdateDriverCommand } from './commands';

describe('DriverService', () => {
  let service: DriverService;
  let queryRunner: QueryRunner;
  let commandRunner: CommandRunner;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DriverService],
    })
      .useMocker((token) => {
        return mockToken(token);
      })
      .compile();

    service = module.get<DriverService>(DriverService);
    queryRunner = module.get<QueryRunner>(QueryRunner);
    commandRunner = module.get<CommandRunner>(CommandRunner);
  });

  describe('getOneById', () => {
    it('should return a driver entity when found', async () => {
      const id = '123';
      const clientId = '456';
      const driver = new DriverEntity();
      jest.spyOn(queryRunner, 'run').mockResolvedValue(driver);

      const result = await service.getOneById(id, clientId);
      expect(result).toBe(driver);
      expect(queryRunner.run).toHaveBeenCalledWith(
        new GetDriverQuery(id, clientId),
      );
    });

    it('should throw an EntityNotFoundError when driver is not found', async () => {
      const id = '123';
      const clientId = '456';
      jest.spyOn(queryRunner, 'run').mockResolvedValue(null);

      await expect(service.getOneById(id, clientId)).rejects.toThrow(
        EntityNotFoundError,
      );
      expect(queryRunner.run).toHaveBeenCalledWith(
        new GetDriverQuery(id, clientId),
      );
    });
  });

  describe('findAll', () => {
    it('should return a PageResult of driver entities', async () => {
      const clientId = '456';
      const criteria: QueryCriteria = {
        filters: [],
        page: new PageCriteria({
          page: 1,
          limit: 10,
        }),
        sort: [],
      };
      const items = [new DriverEntity()];
      const result = {
        items,
        count: 1,
      };
      jest.spyOn(queryRunner, 'run').mockResolvedValue(result);

      const pageResult = await service.findAll(clientId, criteria);
      expect(pageResult).toBeInstanceOf(PageResult);
      expect(pageResult.items).toBe(items);
      expect(pageResult.pagination).toBeInstanceOf(PaginationResult);
      expect(pageResult.pagination).toEqual(
        new PaginationResult(criteria.page.page, criteria.page.limit, 1),
      ),
        expect(queryRunner.run).toHaveBeenCalledWith(
          new FindDriversQuery(clientId, criteria),
        );
    });
  });

  describe('create', () => {
    it('should return entity ', async () => {
      const request: CreateDriverRequest = {
        name: 'John Doe',
        phoneNumber: '+401234567890',
      };
      const clientId = '123';
      const expectedEntity = new DriverEntity();
      expectedEntity.name = request.name;
      expectedEntity.phoneNumber = request.phoneNumber;

      jest.spyOn(commandRunner, 'run').mockResolvedValue(expectedEntity);

      const result = await service.create(request, clientId);

      expect(commandRunner.run).toHaveBeenCalledWith(
        new CreateDriverCommand(request, clientId),
      );
      expect(result).toEqual(expectedEntity);
    });
  });

  describe('update', () => {
    it('should return the updated entity if successful', async () => {
      const driverId = '123';
      const clientId = '456';
      const payload: UpdateDriverRequest = {
        name: 'John Doe',
        phoneNumber: '+401234567890',
      };

      const updatedEntity: DriverEntity = new DriverEntity();
      updatedEntity.id = driverId;
      updatedEntity.clientId = clientId;
      updatedEntity.name = payload.name;
      updatedEntity.phoneNumber = payload.phoneNumber;

      jest.spyOn(commandRunner, 'run').mockResolvedValue(updatedEntity);

      const result = await service.update(driverId, clientId, payload);

      expect(commandRunner.run).toHaveBeenCalledWith(
        new UpdateDriverCommand(driverId, clientId, payload),
      );
      expect(result).toEqual(updatedEntity);
    });
  });
});
