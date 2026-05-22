import { AWSModule } from '@module-aws';
import { BobtailConfigModule } from '@module-config';
import { Module } from '@nestjs/common';
import { CqrsModule as NestCqrsModule } from '@nestjs/cqrs';
import { CommandRunner } from './command';
import { QueryRunner } from './query';

@Module({
  providers: [CommandRunner, QueryRunner],
  exports: [CommandRunner, QueryRunner],
  imports: [BobtailConfigModule, AWSModule, NestCqrsModule],
  controllers: [],
})
export class CqrsModule {}
