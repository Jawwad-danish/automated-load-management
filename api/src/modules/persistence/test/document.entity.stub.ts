import { DocumentEntity, DocumentType, RecordStatus } from '../entities';

export const buildStubDocumentEntity = (data?: Partial<DocumentEntity>) => {
  const entity = new DocumentEntity();
  entity.s3Key = 's3-key';
  entity.s3Bucket = 's3-bucket';
  entity.filestackUrl = 'filestack-url';
  entity.type = DocumentType.RateConfirmation;
  entity.name = 'document';
  entity.createdAt = new Date();
  entity.recordStatus = RecordStatus.Active;
  if (data) {
    Object.assign(entity, data);
  }
  return entity;
};
