import { generateUniqueId } from '@core';
import {
  DocumentRequestEntity,
  DocumentRequestStatus,
  LoadEntity,
} from '../entities';

export const buildStubDocumentRequestEntity = (
  data?: Partial<DocumentRequestEntity>,
) => {
  const entity = new DocumentRequestEntity();
  entity.status = DocumentRequestStatus.Sent;
  entity.driverId = generateUniqueId();
  entity.driverName = 'John';
  entity.driverPhoneNumber = '1234';
  entity.url = 'https://documenRequest';
  entity.load = new LoadEntity();
  if (data) {
    Object.assign(entity, data);
  }
  return entity;
};
