import { BobtailConfigModule } from '@module-config';
import { CqrsModule } from '@module-cqrs';
import { DatabaseModule } from '@module-database';
import { PersistenceModule } from '@module-persistence';
import { Module } from '@nestjs/common';
import { AuthModule } from '../auth';
import { ClientApi } from './api';
import { ClientService } from './services';

@Module({
  imports: [
    AuthModule,
    DatabaseModule,
    BobtailConfigModule,
    PersistenceModule,
    CqrsModule,
  ],
  providers: [ClientService, ClientApi],
  exports: [ClientService],
})
export class ClientsModule {}
