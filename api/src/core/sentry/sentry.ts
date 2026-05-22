import { environment } from '@core/environment';
import { CONFIG_SERVICE, ConfigService } from '@module-config';
import { INestApplication } from '@nestjs/common';
import * as Sentry from '@sentry/node';

const SENTRY_ENABLED = 'SENTRY_ENABLED';
const SENTRY_DSN = 'SENTRY_DSN';
const SENTRY_SAMPLE_RATE_ERRORS = 'SENTRY_SAMPLE_RATE_ERRORS';

export const initSentry = (app: INestApplication) => {
  const configService = app.get<ConfigService>(CONFIG_SERVICE);
  const isSentryEnabled = configService.getValue(SENTRY_ENABLED).asBoolean();
  const sentryDsn = configService.getValue(SENTRY_DSN).asString();
  const sentrySampleRate = configService
    .getValue(SENTRY_SAMPLE_RATE_ERRORS)
    .asNumber();
  Sentry.init({
    enabled: isSentryEnabled,
    dsn: sentryDsn,
    environment: environment.core.nodeEnv(),

    sampleRate: sentrySampleRate,
    tracePropagationTargets: [],
    beforeSend: (event) => {
      // Don't send authorization headers to Sentry
      if (
        event.request &&
        event.request.headers &&
        event.request.headers.authorization
      ) {
        delete event.request.headers.authorization;
      }

      return event;
    },
    tracesSampler: (samplingContext) => {
      if (samplingContext.parentSampled !== undefined) {
        return samplingContext.parentSampled;
      }

      if (samplingContext.request?.url === undefined) {
        return 0;
      }

      const { pathname } = new URL(samplingContext.request?.url);

      if (pathname === '/health') {
        return 0;
      }

      return 0.3; // SAMPLE RATE TRANSACTIONS
    },
  });
  app.use(Sentry.Handlers.requestHandler());
  app.use(Sentry.Handlers.tracingHandler());
};
