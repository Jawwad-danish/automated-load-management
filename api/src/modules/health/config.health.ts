import { Inject, Injectable } from '@nestjs/common';
import { HealthIndicator, HealthIndicatorResult } from '@nestjs/terminus';
import {
  ConfigService,
  CONFIG_SERVICE,
} from '../bobtail-config/config.service';

@Injectable()
export class ConfigHealthIndicator extends HealthIndicator {
  constructor(
    @Inject(CONFIG_SERVICE) private readonly configService: ConfigService,
  ) {
    super();
  }

  async isHealthy(): Promise<HealthIndicatorResult> {
    const isHealthy = this.configService.isLive();
    return this.getStatus('config', isHealthy, {});
  }
}
