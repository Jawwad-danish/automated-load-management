import { AuthModule } from '@module-auth';
import { DatabaseModule } from '@module-database';
import { DocumentsModule } from '@module-documents';
import { DocumentsRequestModule } from '@module-documents-request';
import { LoadsModule } from '@module-loads';
import { Logger, Module, OnApplicationShutdown } from '@nestjs/common';
import { HealthModule } from '../health/health.modules';
import { DriversModule } from '@module-drivers';
import { ClientsModule } from '../clients';
import { SentryExceptionInterceptor } from '@core';
import { LoadsTagActivityModule } from '../load-tag-activity';
import { TagDefinitionsModule } from '../tag-definitions';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ScheduleModule } from '@nestjs/schedule';
import { BobtailLoggingModule } from '../logging';

@Module({
  imports: [
    BobtailLoggingModule,
    EventEmitterModule.forRoot(),
    ScheduleModule.forRoot(),
    HealthModule,
    DatabaseModule,
    AuthModule,
    LoadsModule,
    DocumentsModule,
    DocumentsRequestModule,
    DriversModule,
    ClientsModule,
    LoadsTagActivityModule,
    TagDefinitionsModule,
  ],
  controllers: [],
  providers: [SentryExceptionInterceptor],
})
export class AppModule implements OnApplicationShutdown {
  protected logger: Logger = new Logger(AppModule.name);

  onApplicationShutdown(signal?: string) {
    this.logger.warn('Application shutdowndown with signal %s', signal);
  }
}
