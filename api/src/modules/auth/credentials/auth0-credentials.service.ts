import { Inject, Injectable, Logger } from '@nestjs/common';
import { CONFIG_SERVICE, ConfigService } from '@module-config';
import { SECRETS_MANAGER, SecretsManager } from '@module-aws';

export interface Auth0Credentials {
  domain: string;
  audience: string;
}

@Injectable()
export class Auth0CredentialsService {
  private readonly logger: Logger = new Logger(Auth0CredentialsService.name);

  constructor(
    @Inject(CONFIG_SERVICE) private readonly configService: ConfigService,
    @Inject(SECRETS_MANAGER) private readonly secretsManager: SecretsManager,
  ) {}

  async get(): Promise<Auth0Credentials> {
    const config = this.configService.getValue('AUTH0_SECRET_ARN');
    const arn = config.asString();
    try {
      const secrets = await this.secretsManager.fromARN(arn);
      return {
        audience: secrets.AUTH0_AUDIENCE as string,
        domain: secrets.AUTH0_DOMAIN as string,
      };
    } catch (err) {
      this.logger.error(`Could not obtain secrets from ARN ${arn}`, err);
      throw err;
    }
  }
}
