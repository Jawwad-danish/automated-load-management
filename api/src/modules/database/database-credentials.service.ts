import { SECRETS_MANAGER, SecretsManager } from '@module-aws';
import { CONFIG_SERVICE, ConfigService, Config } from '@module-config';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { Observable, ReplaySubject, Subject } from 'rxjs';

const VALUE_TO_OBSERVE = 'DB_SECRET_ARN';

export type DatabaseCredentials = {
  username: string;
  password: string;
  database: string;
  host: string;
  port: number;
};

@Injectable()
export class DatabaseCredentialsService {
  private readonly logger: Logger = new Logger(DatabaseCredentialsService.name);
  private subject: Subject<DatabaseCredentials> =
    new ReplaySubject<DatabaseCredentials>();

  constructor(
    @Inject(CONFIG_SERVICE) readonly configService: ConfigService,
    @Inject(SECRETS_MANAGER) readonly secretsManager: SecretsManager,
  ) {
    configService
      .observeValue(VALUE_TO_OBSERVE)
      .subscribe((config) => this.onSecretArnChange(config));
  }

  private async onSecretArnChange(config: Config) {
    const arn = config.asString();
    try {
      const secrets = await this.secretsManager.fromARN(arn);
      this.subject.next({
        username: secrets.username as string,
        password: secrets.password as string,
        database: secrets.dbname as string,
        port: secrets.port as number,
        host: secrets.host as string,
      });
    } catch (error) {
      this.logger.error(`Could not obtain secrets from ARN ${arn}`, error);
    }
  }

  observe(): Observable<DatabaseCredentials> {
    return this.subject;
  }
}
