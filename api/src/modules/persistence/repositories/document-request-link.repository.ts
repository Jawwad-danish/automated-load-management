import { DatabaseService } from '@module-database';
import { Inject, Injectable } from '@nestjs/common';
import { DocumentRequestLinkEntity } from '../entities';
import { BasicRepository } from './basic-repository';

@Injectable()
export class DocumentRequestLinkRepository extends BasicRepository<DocumentRequestLinkEntity> {
  constructor(@Inject(DatabaseService) databaseService: DatabaseService) {
    super(databaseService, DocumentRequestLinkEntity);
  }
}
