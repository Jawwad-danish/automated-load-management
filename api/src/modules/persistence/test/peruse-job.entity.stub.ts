import { generateUniqueId } from '@core';
import { InternalJobType, PeruseJobEntity, RecordStatus } from '../entities';

export const buildStubPeruseJobEntity = (data?: Partial<PeruseJobEntity>) => {
  const entity = new PeruseJobEntity();
  entity.id = generateUniqueId();
  entity.jobType = InternalJobType.Classify;
  entity.createdAt = new Date();
  entity.recordStatus = RecordStatus.Active;
  if (data) {
    Object.assign(entity, data);
  }
  return entity;
};
