import { DatabaseService } from '@module-database';
import { Inject, Injectable } from '@nestjs/common';
import { EmailEntity } from '../entities';
import { BasicRepository } from './basic-repository';

@Injectable()
export class EmailRepository extends BasicRepository<EmailEntity> {
  constructor(@Inject(DatabaseService) databaseService: DatabaseService) {
    super(databaseService, EmailEntity);
  }
}
