import { buildStubPeruseClassificationResult } from '@module-peruse';
import {
  PeruseDocumentResultEntity,
  PeruseJobStatus,
  RecordStatus,
} from '../entities';
import { buildStubPeruseJobEntity } from './peruse-job.entity.stub';

export const buildStubPeruseDocumentResultEntity = (
  data?: Partial<PeruseDocumentResultEntity>,
) => {
  const entity = new PeruseDocumentResultEntity();
  entity.job = buildStubPeruseJobEntity();
  entity.payload = buildStubPeruseClassificationResult();
  entity.status = PeruseJobStatus.Success;
  entity.createdAt = new Date();
  entity.recordStatus = RecordStatus.Active;
  if (data) {
    Object.assign(entity, data);
  }
  return entity;
};
