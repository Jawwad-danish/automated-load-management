import { AWSModule } from '@module-aws';
import { ClientsModule } from '@module-clients';
import { BobtailConfigModule } from '@module-config';
import { CqrsModule } from '@module-cqrs';
import { DatabaseModule } from '@module-database';
import { FilestackModule } from '@module-filestack';
import { PersistenceModule } from '@module-persistence';
import { Module } from '@nestjs/common';
import { DocumentsController, ScannedDocumentsController } from './controllers';
import { DocumentMapper } from './data';
import {
  DeleteDocumentCommandHandler,
  DocumentService,
  UpdateDocumentEventHandler,
  UploadDocumentCommandHandler,
  UploadScannedDocumentCommandHandler,
} from './services';
import { PeruseModule } from '../peruse';
import { SegmentModule } from '@module-segment';

const commands = [
  DeleteDocumentCommandHandler,
  UploadDocumentCommandHandler,
  UploadScannedDocumentCommandHandler,
];

const eventHandlers = [UpdateDocumentEventHandler];

@Module({
  imports: [
    PersistenceModule,
    CqrsModule,
    BobtailConfigModule,
    DatabaseModule,
    AWSModule,
    ClientsModule,
    FilestackModule,
    PeruseModule,
    SegmentModule,
  ],
  controllers: [DocumentsController, ScannedDocumentsController],
  providers: [DocumentService, DocumentMapper, ...commands, ...eventHandlers],
  exports: [DocumentService, DocumentMapper],
})
export class DocumentsModule {}
