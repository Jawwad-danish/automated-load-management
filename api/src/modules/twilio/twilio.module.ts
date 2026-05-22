import { AWSModule } from '@module-aws';
import { BobtailConfigModule } from '@module-config';
import { Module } from '@nestjs/common';
import { TwilioService, TWILIO_CREDENTIALS_SERVICE } from './services';
import { TwilioCredentialServiceProvider } from './twilio-service.provider';

@Module({
  imports: [BobtailConfigModule, AWSModule],
  providers: [TwilioCredentialServiceProvider, TwilioService],
  exports: [TwilioService, TWILIO_CREDENTIALS_SERVICE],
})
export class TwilioModule {}
