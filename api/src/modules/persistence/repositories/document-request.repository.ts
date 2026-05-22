import { DatabaseService } from '@module-database';
import { Inject, Injectable } from '@nestjs/common';
import { DocumentRequestEntity } from '../entities';
import { BasicRepository } from './basic-repository';

@Injectable()
export class DocumentRequestRepository extends BasicRepository<DocumentRequestEntity> {
  constructor(@Inject(DatabaseService) databaseService: DatabaseService) {
    super(databaseService, DocumentRequestEntity);
  }

  async getOneById(id: string): Promise<DocumentRequestEntity> {
    return await this.repository.findOneOrFail({
      id,
    });
  }
}
