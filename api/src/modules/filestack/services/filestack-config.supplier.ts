import { SECRETS_MANAGER, SecretsManager } from '@module-aws';
import { CONFIG_SERVICE, ConfigService } from '@module-config';
import { Inject, Injectable, Logger } from '@nestjs/common';

export interface FilestackConfig {
  key: string;
  secret: string;
}

@Injectable()
export class FilestackConfigSupplier {
  private readonly logger: Logger = new Logger(FilestackConfigSupplier.name);

  constructor(
    @Inject(CONFIG_SERVICE) private readonly configService: ConfigService,
    @Inject(SECRETS_MANAGER) private readonly secretsManager: SecretsManager,
  ) {}

  async get(): Promise<FilestackConfig> {
    const config = this.configService.getValue('FILESTACK_SECRET_ARN');
    const arn = config.asString();
    try {
      const secrets = await this.secretsManager.fromARN(arn);
      return {
        key: secrets.FILESTACK_KEY as string,
        secret: secrets.FILESTACK_SECRET as string,
      };
    } catch (err) {
      this.logger.error(`Could not obtain secrets from ARN ${arn}`, err);
      throw err;
    }
  }
}
