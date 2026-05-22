import {
  AWSModule,
  SECRETS_MANAGER,
  secretsManagerProvider,
} from '@module-aws';
import { DatabaseCredentialsModule } from '@module-database';
import { Module } from '@nestjs/common';
import {
  BobtailConfigModule,
  CONFIG_SERVICE,
  configServiceProvider,
} from '@module-config';

@Module({
  imports: [BobtailConfigModule, AWSModule, DatabaseCredentialsModule],
  providers: [secretsManagerProvider, configServiceProvider],
  exports: [CONFIG_SERVICE, SECRETS_MANAGER],
})
export class MigrationModule {}
