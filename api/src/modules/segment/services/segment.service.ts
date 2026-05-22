import { Injectable, Logger, OnApplicationShutdown } from '@nestjs/common';
import { Analytics } from '@segment/analytics-node';

@Injectable()
export class SegmentService implements OnApplicationShutdown {
  private readonly logger: Logger = new Logger(SegmentService.name);
  constructor(private readonly analytics: Analytics) {
    this.analytics.on('error', (err) => {
      this.logger.error({
        message: 'segment-event-failure',
        error: err,
      });
    });
  }

  async onApplicationShutdown() {
    await this.analytics.closeAndFlush({ timeout: 5000 });
    this.logger.log(
      `Received application shutdown signal. Flush and close segment app.`,
    );
  }

  identify(id: string, traits: any): void {
    try {
      this.analytics.identify({ userId: id, traits: traits });

      this.logger.debug(`Identify ${id} sent to SEGMENT `);
    } catch (error) {
      this.logger.error(`Failed to send identify ${id} to SEGMENT. ${error}`);
    }
  }

  track(id: string, event: string, properties: any): void {
    try {
      this.analytics.track({
        userId: id,
        event: event,
        properties: properties,
      });
      this.logger.debug(`Track event ${event} sent to SEGMENT `);
    } catch (error) {
      this.logger.error(`Failed to send event ${event} to SEGMENT. ${error}`);
    }
  }
}
