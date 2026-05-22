import { DriverEntity, RecordStatus } from '../entities';

export const buildStubDriverEntity = (data?: Partial<DriverEntity>) => {
  const entity = new DriverEntity();
  entity.name = 'John Doe';
  entity.phoneNumber = '+123456789';
  entity.createdAt = new Date();
  entity.recordStatus = RecordStatus.Active;
  if (data) {
    Object.assign(entity, data);
  }
  return entity;
};
