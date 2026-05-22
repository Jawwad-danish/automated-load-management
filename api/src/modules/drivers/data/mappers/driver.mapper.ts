import { DataMapper } from '@core/mapping';
import { DriverEntity } from '@module-persistence/entities';
import { Injectable } from '@nestjs/common';
import { Driver } from '../models';
import { CreateDriverRequest } from '../web';

@Injectable()
export class DriverMapper implements DataMapper<DriverEntity, Driver> {
  async entityToModel(entity: DriverEntity): Promise<Driver> {
    const model = new Driver();
    model.id = entity.id;
    model.name = entity.name;
    model.phoneNumber = entity.phoneNumber;
    return model;
  }

  async createRequestToEntity(
    request: CreateDriverRequest,
  ): Promise<DriverEntity> {
    const entity = new DriverEntity();
    entity.name = request.name;
    entity.phoneNumber = request.phoneNumber;
    return entity;
  }
}
