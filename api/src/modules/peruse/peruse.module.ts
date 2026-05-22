import { AWSModule } from '@module-aws';
import { BobtailConfigModule } from '@module-config';
import { DatabaseModule } from '@module-database';
import { PersistenceModule } from '@module-persistence';
import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { PeruseJobMapper } from './data';
import {
  CheckJobStatusesJob,
  PeruseConfigSupplier,
  PeruseService,
} from './services';

@Module({
  imports: [
    DatabaseModule,
    BobtailConfigModule,
    AWSModule,
    HttpModule,
    PersistenceModule,
  ],
  providers: [
    PeruseService,
    CheckJobStatusesJob,
    PeruseConfigSupplier,
    PeruseJobMapper,
  ],
  exports: [PeruseService],
})
export class PeruseModule {}
