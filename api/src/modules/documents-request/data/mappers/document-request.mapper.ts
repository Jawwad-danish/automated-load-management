import { DocumentRequestEntity } from '@module-persistence/entities';
import { Injectable } from '@nestjs/common';
import { DataMapper } from '@core/mapping';
import { DocumentRequest } from '../models';

@Injectable()
export class DocumentsRequestMapper
  implements DataMapper<DocumentRequestEntity, any>
{
  async entityToModel(entity: DocumentRequestEntity): Promise<DocumentRequest> {
    const model = new DocumentRequest();
    model.id = entity.id;
    model.driverName = entity.driverName;
    model.driverPhoneNumber = entity.driverPhoneNumber;
    model.url = entity.url;
    model.driverId = entity.driverId;
    model.status = entity.status;
    model.createdAt = entity.createdAt;
    model.updatedAt = entity.updatedAt;

    return model;
  }
}
