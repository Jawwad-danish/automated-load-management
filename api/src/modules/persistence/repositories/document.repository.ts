import { DatabaseService } from '@module-database';
import { Inject, Injectable } from '@nestjs/common';
import { DocumentEntity, RecordStatus } from '../entities';
import { BasicRepository } from './basic-repository';

@Injectable()
export class DocumentRepository extends BasicRepository<DocumentEntity> {
  constructor(@Inject(DatabaseService) databaseService: DatabaseService) {
    super(databaseService, DocumentEntity);
  }

  async findInLoad(
    loadId: string,
    documentId: string,
  ): Promise<null | DocumentEntity> {
    const found = await this.repository.findOne({
      id: documentId,
      load: {
        id: loadId,
      },
      recordStatus: RecordStatus.Active,
    });
    return found ?? null;
  }

  async getOneById(id: string): Promise<DocumentEntity> {
    return await this.repository.findOneOrFail({
      id,
    });
  }
}
