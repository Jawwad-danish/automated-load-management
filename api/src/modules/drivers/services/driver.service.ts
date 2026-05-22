import { PageResult, PaginationResult, QueryCriteria } from '@core/data';
import { CrossCuttingConcerns } from '@core/util';
import { CommandRunner, QueryRunner } from '@module-cqrs';
import { Injectable } from '@nestjs/common';
import { DriverEntity } from '@module-persistence';
import { FindDriversQuery } from './queries/find-drivers.query';
import { GetDriverQuery } from './queries/get-driver.query';
import { EntityNotFoundError } from '@core/errors';
import { Transactional } from '@module-database';
import { CreateDriverRequest, UpdateDriverRequest } from '../data';
import {
  CreateDriverCommand,
  DeleteDriverCommand,
  UpdateDriverCommand,
} from './commands';

@Injectable()
export class DriverService {
  constructor(
    private readonly queryRunner: QueryRunner,
    private readonly commandRunner: CommandRunner,
  ) {}

  @CrossCuttingConcerns<DriverService, 'create'>({
    logging: (payload: CreateDriverRequest, clientId: string) => {
      return {
        message: 'Create driver',
        payload: payload,
        clientId: clientId,
      };
    },
  })
  @Transactional('create-driver')
  async create(
    payload: CreateDriverRequest,
    clientId: string,
  ): Promise<DriverEntity> {
    return this.commandRunner.run(new CreateDriverCommand(payload, clientId));
  }

  @CrossCuttingConcerns<DriverService, 'update'>({
    logging: (
      driverId: string,
      clientId: string,
      payload: UpdateDriverRequest,
    ) => {
      return {
        message: 'Update driver',
        payload: payload,
        driverId: driverId,
        clientId: clientId,
      };
    },
  })
  @Transactional('update-driver')
  async update(
    driverId: string,
    clientId: string,
    payload: UpdateDriverRequest,
  ): Promise<DriverEntity> {
    return this.commandRunner.run(
      new UpdateDriverCommand(driverId, clientId, payload),
    );
  }

  @CrossCuttingConcerns<DriverService, 'delete'>({
    logging: (driverId: string, clientId: string) => {
      return {
        message: 'Delete driver from load',
        payload: {
          clientId,
          driverId,
        },
      };
    },
  })
  @Transactional('delete-driver')
  async delete(driverId: string, clientId: string) {
    await this.commandRunner.run(new DeleteDriverCommand(driverId, clientId));
  }

  @CrossCuttingConcerns<DriverService, 'getOneById'>({
    logging: (id: string) => {
      return {
        message: 'Get driver by id',
        id: id,
      };
    },
  })
  async getOneById(id: string, clientId: string): Promise<DriverEntity> {
    const entity = await this.queryRunner.run(new GetDriverQuery(id, clientId));
    if (!entity) {
      throw EntityNotFoundError.byId(id, 'Driver');
    }
    return entity;
  }

  @CrossCuttingConcerns<DriverService, 'findAll'>({
    logging: (clientId: string, criteria: QueryCriteria) => {
      return {
        message: 'Fetching drivers with query criteria',
        payload: { clientId, criteria },
      };
    },
  })
  async findAll(
    clientId: string,
    criteria: QueryCriteria,
  ): Promise<PageResult<DriverEntity>> {
    const result = await this.queryRunner.run(
      new FindDriversQuery(clientId, criteria),
    );
    return new PageResult(
      result.items,
      new PaginationResult(
        criteria.page.page,
        criteria.page.limit,
        result.count,
      ),
    );
  }
}
