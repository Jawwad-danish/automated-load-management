import { BobtailConfigModule } from '@module-config';
import { PersistenceModule } from '@module-persistence';
import { Module } from '@nestjs/common';
import { AuthModule } from '../auth';
import { DatabaseModule } from '../database/database.module';
import { BrokerApi } from './api';
import { BrokerService } from './services';

@Module({
  imports: [AuthModule, DatabaseModule, BobtailConfigModule, PersistenceModule],
  providers: [BrokerService, BrokerApi],
  exports: [BrokerService],
  controllers: [],
})
export class BrokersModule {}
