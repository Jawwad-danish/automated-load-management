import { EmailAttachmentEntity, EmailEntity } from '../entities';

export const buildStubEmailEntity = (
  data?: Partial<
    Omit<EmailEntity, 'attachments'> & {
      attachments: EmailAttachmentEntity[];
    }
  >,
) => {
  const entity = new EmailEntity();
  entity.body = '';
  entity.fromEmail = 'test@bobtail.com';
  entity.fromName = 'Bobtail';
  entity.messageId = '123';
  entity.s3Bucket = 'bucket';
  entity.s3Key = 'key';
  if (data?.attachments) {
    entity.attachments.hydrate(data.attachments);
    delete data.attachments;
  }
  Object.assign(entity, data);
  return entity;
};
