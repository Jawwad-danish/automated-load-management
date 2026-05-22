import { DatabaseService } from '@module-database';
import { Inject, Injectable } from '@nestjs/common';
import { PeruseJobEntity } from '../entities';
import { BasicRepository } from './basic-repository';

@Injectable()
export class PeruseJobRepository extends BasicRepository<PeruseJobEntity> {
  constructor(@Inject(DatabaseService) databaseService: DatabaseService) {
    super(databaseService, PeruseJobEntity);
  }
}
