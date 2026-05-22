import { EmailAttachmentEntity } from '../entities';
import { buildStubEmailEntity } from './email.entity.stub';

export const buildStubEmailAttachmentEntity = (
  data?: Partial<EmailAttachmentEntity>,
) => {
  const entity = new EmailAttachmentEntity();
  entity.fileName = 'filename';
  entity.contentType = 'abc';
  entity.s3Bucket = 'bucket';
  entity.s3Key = 'key';
  entity.email = buildStubEmailEntity();
  Object.assign(entity, data);
  return entity;
};
