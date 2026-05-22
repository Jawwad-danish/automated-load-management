import { Controller, Get, Injectable } from '@nestjs/common';
import { HealthCheck, HealthCheckService } from '@nestjs/terminus';
import { ConfigHealthIndicator } from './config.health';
import { DatabaseHealthIndicator } from './database.health';
import { Public } from '@module-auth';

@Controller()
@Public()
@Injectable()
export class HealthController {
  constructor(
    private health: HealthCheckService,
    private database: DatabaseHealthIndicator,
    private config: ConfigHealthIndicator,
  ) {}

  @Get('health')
  @HealthCheck()
  check() {
    return this.health.check([
      () => this.config.isHealthy(),
      () => this.database.isHealthy(),
    ]);
  }

  @Get('time')
  time() {
    return {
      unixTimestampMs: Date.now(),
    };
  }
}
