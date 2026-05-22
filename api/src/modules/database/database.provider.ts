import { Provider } from '@nestjs/common';
import { DatabaseCredentialsService } from './database-credentials.service';
import { DatabaseService } from './database.service';

export const databaseServiceProvider: Provider = {
  provide: DatabaseService,
  useFactory: async (
    databaseCredentialsService: DatabaseCredentialsService,
  ) => {
    const service = new DatabaseService(databaseCredentialsService);
    await service.connect();
    await service.installExtensions();
    return service;
  },
  inject: [DatabaseCredentialsService],
};
