import { Logger } from '@nestjs/common';
import * as Sentry from '@sentry/node';
import { CaptureContext, MonitorConfig, Primitive } from '@sentry/types';

const cronLogger = new Logger('SentryCron');

export class Observability {
  static setTag(key: string, value: Primitive) {
    Sentry.configureScope((scope) => {
      scope.setTag(key, value);
    });
  }

  static captureError(error: Error) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    Sentry.configureScope((_scope) => {
      Sentry.captureException(error);
    });
  }

  static setTransactionName(name: string) {
    Sentry.configureScope((scope) => {
      scope.setTransactionName(name);
    });
  }

  static captureMessage(message: string, captureContext: CaptureContext) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    Sentry.configureScope((_scope) => {
      Sentry.captureMessage(message, captureContext);
    });
  }

  static withMonitor<T>(
    monitorSlug: string,
    callback: () => Promise<T>,
    upsertMonitorConfig?: MonitorConfig,
  ): Promise<T | void> {
    return new Promise((resolve) => {
      Sentry.withScope(async () => {
        cronLogger.debug(`Starting sentry monitor for ${monitorSlug}`);
        try {
          const result = await Sentry.withMonitor(
            monitorSlug,
            callback,
            upsertMonitorConfig,
          );
          resolve(result);
        } catch (error) {
          cronLogger.error(error.message);
          resolve();
        } finally {
          cronLogger.debug(`Finished sentry monitor for ${monitorSlug}`);
        }
      });
    });
  }
}
