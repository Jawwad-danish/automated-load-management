import { DatabaseService } from '@module-database';
import { Inject, Injectable } from '@nestjs/common';
import { AddressEntity } from '../entities';
import { BasicRepository } from './basic-repository';

@Injectable()
export class AddressRepository extends BasicRepository<AddressEntity> {
  constructor(@Inject(DatabaseService) databaseService: DatabaseService) {
    super(databaseService, AddressEntity);
  }
}
