import { NestFactory } from '@nestjs/core';
import { firstValueFrom } from 'rxjs';
import { MigrationModule } from './migrations.module';
import {
  DatabaseCredentials,
  DatabaseCredentialsService,
} from '@module-database';

export const getDatabaseCredentials =
  async (): Promise<DatabaseCredentials> => {
    const migrationModule =
      await NestFactory.createApplicationContext(MigrationModule);
    const credentialsService = migrationModule.get(DatabaseCredentialsService);
    const source = credentialsService.observe();
    const credentials = await firstValueFrom(source);
    await migrationModule.close();
    return credentials;
  };
