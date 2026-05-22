import {
  MikroORM,
  RequestContext,
  UnderscoreNamingStrategy,
} from '@mikro-orm/core';
import { PostgreSqlDriver, defineConfig } from '@mikro-orm/postgresql';
import { entities } from '@module-persistence/entities';
import { Logger, OnApplicationShutdown } from '@nestjs/common';
import { firstValueFrom, skip, throwError, timeout } from 'rxjs';
import { EntityNotFoundError } from '../../core/errors';
import {
  DatabaseCredentials,
  DatabaseCredentialsService,
} from './database-credentials.service';

export class DatabaseService implements OnApplicationShutdown {
  protected mikroORM: MikroORM<PostgreSqlDriver>;
  private readonly logger: Logger = new Logger(DatabaseService.name);

  constructor(
    private readonly databaseCredentialsService: DatabaseCredentialsService,
  ) {}

  async onApplicationShutdown() {
    this.logger.log(
      `Received application shutdown signal. Closing database connection.`,
    );
    await this.mikroORM.close();
  }

  async connect(): Promise<void> {
    this.logger.log('Loading database connection');
    const databaseCredentials = await this.getDatabaseCredentials();
    await this.buildMikroORM(databaseCredentials);
    this.databaseCredentialsService
      .observe()
      .pipe(skip(1))
      .subscribe((credentials) => {
        this.onDatabaseCredentialsChange(credentials);
      });
  }

  private async getDatabaseCredentials(): Promise<DatabaseCredentials> {
    this.logger.debug('Fetching database credentials');
    const timeoutMS: number = parseInt(
      process.env.DB_INITIAL_CONNECTION_TIMEOUT || '30000',
      10,
    );
    const source = this.databaseCredentialsService.observe().pipe(
      timeout({
        each: timeoutMS,
        with: () =>
          throwError(
            () =>
              new Error(
                `Could not obtain database credentials after ${timeoutMS} miliseconds`,
              ),
          ),
      }),
    );
    return firstValueFrom(source);
  }

  private async onDatabaseCredentialsChange(credentials: DatabaseCredentials) {
    this.logger.log('Initializing the database with new credentials');
    if (this.mikroORM) {
      try {
        this.logger.warn('Closing the existing database connection');
        await this.mikroORM.close();
      } catch (error) {
        this.logger.error(
          'Could not close existing database connection',
          error,
        );
      }
    } else {
      this.buildMikroORM(credentials);
    }
  }

  private async buildMikroORM(credentials: DatabaseCredentials) {
    const options = defineConfig({
      user: credentials.username,
      password: credentials.password,
      dbName: credentials.database,
      namingStrategy: UnderscoreNamingStrategy,
      host: credentials.host,
      port: credentials.port,
      entities,
      allowGlobalContext: false,
      connect: true,
      pool: {
        min: 0,
      },
      findOneOrFailHandler: (entityName) => {
        throw new EntityNotFoundError(
          `Could not find ${entityName.toLowerCase().replace('entity', '')}`,
        );
      },
    });
    this.mikroORM = await MikroORM.init<PostgreSqlDriver>(options);
    this.logger.debug('Connected to database');
  }

  async isConnected(): Promise<boolean> {
    if (!this.mikroORM) {
      return false;
    }
    return this.mikroORM.isConnected();
  }

  getMikroORM(): MikroORM<PostgreSqlDriver> {
    return this.mikroORM;
  }

  withRequestContext<T>(next: (...args: any[]) => T): T {
    return RequestContext.create(this.getMikroORM().em, next);
  }

  async installExtensions() {
    this.logger.debug('Installing database extensions if not found');
    const extensions = ['uuid-ossp'];
    for (const extension of extensions) {
      await this.mikroORM.em.execute(
        `CREATE EXTENSION IF NOT EXISTS "${extension}"`,
      );
    }
  }
}
