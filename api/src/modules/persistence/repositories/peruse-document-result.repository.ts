import { DatabaseService } from '@module-database';
import { Inject, Injectable } from '@nestjs/common';
import { PeruseDocumentResultEntity } from '../entities';
import { BasicRepository } from './basic-repository';

@Injectable()
export class PeruseDocumentResultRepository extends BasicRepository<PeruseDocumentResultEntity> {
  constructor(@Inject(DatabaseService) databaseService: DatabaseService) {
    super(databaseService, PeruseDocumentResultEntity);
  }

  async getOneByJobId(jobId: string): Promise<PeruseDocumentResultEntity> {
    return await this.repository.findOneOrFail({
      job: jobId,
    });
  }
}
