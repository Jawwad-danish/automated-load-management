import { CqrsModule } from '@module-cqrs';
import { PersistenceModule } from '@module-persistence';
import { Module } from '@nestjs/common';
import { TwilioModule } from '@module-twilio';
import { DocumentsRequestController } from './controllers';
import { DocumentsRequestMapper } from './data';
import {
  DocumentsRequestService,
  DocumentRequestCommandHandler,
} from './services';
import { SegmentModule } from '@module-segment';

const commands = [DocumentRequestCommandHandler];

@Module({
  imports: [PersistenceModule, CqrsModule, TwilioModule, SegmentModule],
  controllers: [DocumentsRequestController],
  providers: [DocumentsRequestService, DocumentsRequestMapper, ...commands],
  exports: [DocumentsRequestMapper],
})
export class DocumentsRequestModule {}
