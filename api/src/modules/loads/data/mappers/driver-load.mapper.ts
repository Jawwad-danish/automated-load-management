import { DataMapper } from '@core/mapping';
import { LoadEntity } from '@module-persistence/entities';
import { Injectable } from '@nestjs/common';
import { Address, DriverLoad, Location } from '../models';
@Injectable()
export class DriverLoadMapper implements DataMapper<LoadEntity, DriverLoad> {
  async entityToModel(entity: LoadEntity): Promise<DriverLoad> {
    return new DriverLoad({
      id: entity.id,
      loadNumber: entity.loadNumber,
      brokerName: entity.brokerName,
      locations: entity.addresses.map((address) => {
        return new Location({
          address: new Address({
            fullAddress: address.fullAddress,
            city: address.city,
            state: address.state,
          }),
          type: address.type,
          createdAt: address.createdAt,
          updatedAt: address.updatedAt,
          recordStatus: address.recordStatus,
        });
      }),
    });
  }
}
