import {
  enableCors,
  enableExceptionsFilters,
  enableRequestContextHelper,
  enableValidationPipes,
} from '@common/middlewares';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import helmet from 'helmet';
import { AppModule } from './modules/app/app.module';
import { initSentry, SentryExceptionInterceptor } from '@core';
import { LoggerService } from '@nestjs/common';
import { LOGGER_PROVIDER } from '@module-logging';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    bufferLogs: true,
    rawBody: true,
  });

  app.useLogger(app.get<LoggerService>(LOGGER_PROVIDER));
  initSentry(app);
  app.useGlobalInterceptors(app.get(SentryExceptionInterceptor));
  app.use(helmet());
  enableRequestContextHelper(app);
  enableCors(app);
  enableValidationPipes(app);
  enableExceptionsFilters(app);

  // Starts listening for shutdown hooks
  app.enableShutdownHooks();
  await app.listen(process.env.PORT || 5000);
}
bootstrap();
