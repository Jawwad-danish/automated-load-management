import { AWSModule } from '@module-aws';
import { BobtailConfigModule } from '@module-config';
import { Module } from '@nestjs/common';
import { FilestackConfigSupplier, Filestack } from './services';

@Module({
  imports: [BobtailConfigModule, AWSModule],
  providers: [FilestackConfigSupplier, Filestack],
  exports: [Filestack],
})
export class FilestackModule {}
