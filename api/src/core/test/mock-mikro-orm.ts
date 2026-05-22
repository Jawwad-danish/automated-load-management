import { MikroORM } from '@mikro-orm/core';
import { PostgreSqlDriver, defineConfig } from '@mikro-orm/postgresql';
import { entities } from '@module-persistence/entities';
import { Provider } from '@nestjs/common';

export const mockMikroORMProvider: Provider = {
  provide: MikroORM,
  useFactory: async () => {
    const options = defineConfig({
      allowGlobalContext: false,
      dbName: 'test',
      host: 'test',
      user: 'test',
      password: 'test',
      connect: false,
      entities: entities,
    });
    return MikroORM.init<PostgreSqlDriver>(options);
  },
};
