import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';
import { BobtailConfigModule } from '@module-config';
import { ConfigHealthIndicator } from './config.health';
import { HealthController } from './health.controller';
import { DatabaseModule } from '@module-database';
import { DatabaseHealthIndicator } from './database.health';

@Module({
  imports: [TerminusModule, HttpModule, BobtailConfigModule, DatabaseModule],
  controllers: [HealthController],
  providers: [ConfigHealthIndicator, DatabaseHealthIndicator],
})
export class HealthModule {}
