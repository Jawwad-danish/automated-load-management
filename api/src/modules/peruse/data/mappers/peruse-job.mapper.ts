import {
  InternalJobType,
  JobEntityType,
  PeruseDocumentResultEntity,
  PeruseJobEntity,
} from '@module-persistence/entities';
import { Injectable } from '@nestjs/common';
import { PeruseClassificationJobResponse } from '../classification-job/peruse-classification-job';
import { PeruseClassificationResult } from '../classification-job/peruse-classification-result';
import { PeruseCreateLoadJobResponse } from '../create-load-job/peruse-create-load-job';
import { PeruseJobType } from '../peruse-job-types';

@Injectable()
export class PeruseJobMapper {
  resultToResultEntity(
    response: PeruseClassificationResult,
  ): PeruseDocumentResultEntity {
    const entity = new PeruseDocumentResultEntity();
    entity.payload = response;
    entity.status = response.status;
    return entity;
  }

  responseToJobEntity(
    response: PeruseClassificationJobResponse | PeruseCreateLoadJobResponse,
    entityType: JobEntityType,
  ): PeruseJobEntity {
    const entity = new PeruseJobEntity();
    entity.id = response.jobId;
    entity.jobType = this.getInternalJobType(response.jobType);
    entity.entityType = entityType;
    if (response.constructor.name === 'PeruseCreateLoadJobResponse') {
      entity.externalId = (response as PeruseCreateLoadJobResponse).loadId;
    } else {
      entity.externalId = (
        response as PeruseClassificationJobResponse
      ).input.document.externalId;
    }
    return entity;
  }

  private getInternalJobType(jobType: PeruseJobType): InternalJobType {
    switch (jobType) {
      case PeruseJobType.Classification:
        return InternalJobType.Classify;
      case PeruseJobType.VerifyLoad:
        return InternalJobType.CreateLoad;
    }
  }
}
