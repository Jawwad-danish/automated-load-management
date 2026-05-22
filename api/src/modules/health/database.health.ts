import { HealthIndicator, HealthIndicatorResult } from '@nestjs/terminus';
import { DatabaseService } from '@module-database';
import { Inject } from '@nestjs/common';

export class DatabaseHealthIndicator extends HealthIndicator {
  constructor(
    @Inject(DatabaseService) private readonly databaseService: DatabaseService,
  ) {
    super();
  }

  async isHealthy(): Promise<HealthIndicatorResult> {
    const isHealthy = await this.databaseService.isConnected();
    return this.getStatus('database', isHealthy, {});
  }
}
