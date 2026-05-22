import { AddressEntity } from './address.entity';
import { DocumentEntity } from './document.entity';
import { DocumentRequestEntity } from './document-request.entity';
import { EmailEntity } from './email.entity';
import { EmailAttachmentEntity } from './email-attachment.entity';
import { LoadEntity } from './load.entity';
import { DriverEntity } from './driver.entity';
import { PeruseDocumentResultEntity } from './peruse-document-result.entity';
import { DocumentRequestLinkEntity } from './document-request-link.entity';
import { PeruseJobEntity } from './peruse-job.entity';
import { TagDefinitionEntity } from './tag-definition.entity';
import { LoadTagEntity } from './load-tag-assoc.entity';
import { ActivityLogEntity } from './activity-log.entity';
import { TagDefinitionGroupEntity } from './tag-definition-group.entity';
import { TagGroupAssocEntity } from './tag-group-assoc.entity';

export * from './primitive.entity';
export * from './basic.entity';
export * from './basic-mutable.entity';
export * from './address.entity';
export * from './document.entity';
export * from './document-request.entity';
export * from './email.entity';
export * from './email-attachment.entity';
export * from './load.entity';
export * from './driver.entity';
export * from './peruse-document-result.entity';
export * from './peruse-job.entity';
export * from './document-request-link.entity';
export * from './tag-definition.entity';
export * from './tag-definition-group.entity';
export * from './tag-group-assoc.entity';
export * from './load-tag-assoc.entity';
export * from './activity-log.entity';

export const entities = [
  EmailEntity,
  EmailAttachmentEntity,
  DocumentEntity,
  DocumentRequestEntity,
  AddressEntity,
  LoadEntity,
  DriverEntity,
  PeruseDocumentResultEntity,
  DocumentRequestLinkEntity,
  PeruseJobEntity,
  TagDefinitionEntity,
  TagDefinitionGroupEntity,
  TagGroupAssocEntity,
  LoadTagEntity,
  ActivityLogEntity,
];
