import { Module } from '@nestjs/common';
import { AWSModule } from '@module-aws';
import { BobtailConfigModule } from '@module-config';
import { DatabaseCredentialsService } from './database-credentials.service';

@Module({
  imports: [BobtailConfigModule, AWSModule],
  providers: [DatabaseCredentialsService],
  exports: [DatabaseCredentialsService],
})
export class DatabaseCredentialsModule {}
