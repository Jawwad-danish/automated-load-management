import { AuthModule } from '@module-auth';
import { AWSModule } from '@module-aws';
import { BobtailConfigModule } from '@module-config';
import { CqrsModule } from '@module-cqrs';
import { DatabaseModule } from '@module-database';
import { DocumentsModule } from '@module-documents';
import { DocumentsRequestModule } from '@module-documents-request';
import { LoadsTagActivityModule } from '@module-load-tag-activity';
import { PersistenceModule } from '@module-persistence';
import { PeruseModule } from '@module-peruse';
import { TagDefinitionsModule } from '@module-tag-definitions';
import { Module } from '@nestjs/common';
import { BrokersModule } from '../brokers';
import { ClientsModule } from '../clients';
import { DriverLoadController, LoadsController } from './controllers';
import {
  ActivityLogMapper,
  DriverLoadMapper,
  LoadMapper,
} from './data/mappers';
import {
  CreateLoadFromEmailEventHandler,
  EmailParsedQueueConsumer,
  LoadsService,
  UpdateLoadCommandHandler,
} from './services';
import { SegmentModule } from '@module-segment';

@Module({
  imports: [
    AuthModule,
    BobtailConfigModule,
    BrokersModule,
    ClientsModule,
    CqrsModule,
    DatabaseModule,
    PersistenceModule,
    PeruseModule,
    DocumentsModule,
    AWSModule,
    DocumentsModule,
    DocumentsRequestModule,
    LoadsTagActivityModule,
    TagDefinitionsModule,
    SegmentModule,
  ],
  controllers: [LoadsController, DriverLoadController],
  providers: [
    LoadsService,
    LoadMapper,
    DriverLoadMapper,
    ActivityLogMapper,
    EmailParsedQueueConsumer,
    CreateLoadFromEmailEventHandler,
    UpdateLoadCommandHandler,
  ],
  exports: [LoadsService],
})
export class LoadsModule {}
