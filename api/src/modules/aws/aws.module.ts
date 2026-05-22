import { Module } from '@nestjs/common';
import { SECRETS_MANAGER, secretsManagerProvider } from './secrets-manager';
import { S3Service } from './s3';

@Module({
  providers: [secretsManagerProvider, S3Service],
  exports: [SECRETS_MANAGER, S3Service],
})
export class AWSModule {}
