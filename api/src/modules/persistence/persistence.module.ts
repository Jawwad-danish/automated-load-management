import { Module } from '@nestjs/common';
import { DatabaseModule } from '@module-database';

import {
  AddressRepository,
  DocumentRepository,
  DocumentRequestRepository,
  EmailRepository,
  EmailAttachmentRepository,
  LoadRepository,
  DriverRepository,
  PeruseDocumentResultRepository,
  DocumentRequestLinkRepository,
  PeruseJobRepository,
  TagDefinitionRepository,
  TagDefinitionGroupRepository,
  ActivityLogRepository,
} from './repositories';

const repositories = [
  ActivityLogRepository,
  AddressRepository,
  DocumentRepository,
  DocumentRequestRepository,
  DocumentRequestLinkRepository,
  EmailRepository,
  EmailAttachmentRepository,
  LoadRepository,
  DriverRepository,
  PeruseDocumentResultRepository,
  PeruseJobRepository,
  TagDefinitionRepository,
  TagDefinitionGroupRepository,
];

@Module({
  imports: [DatabaseModule],
  providers: [...repositories],
  exports: [...repositories],
})
export class PersistenceModule {}
