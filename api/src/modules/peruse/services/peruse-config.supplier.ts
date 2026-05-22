import { SECRETS_MANAGER, SecretsManager } from '@module-aws';
import { CONFIG_SERVICE, ConfigService } from '@module-config';
import { Inject, Injectable, Logger } from '@nestjs/common';

export interface PeruseConfig {
  url: string;
  apiKey: string;
}

@Injectable()
export class PeruseConfigSupplier {
  private readonly logger: Logger = new Logger(PeruseConfigSupplier.name);

  constructor(
    @Inject(CONFIG_SERVICE) private readonly configService: ConfigService,
    @Inject(SECRETS_MANAGER) private readonly secretsManager: SecretsManager,
  ) {}

  async get(): Promise<PeruseConfig> {
    const urlConfig = this.configService.getValue('PERUSE_URL');
    if (!urlConfig.hasValue()) {
      throw new Error(`Could not obtain PERUSE_URL config value`);
    }

    const config = this.configService.getValue('PERUSE_SECRET_ARN');
    const arn = config.asString();
    try {
      const secrets = await this.secretsManager.fromARN(arn);
      return {
        url: urlConfig.asString(),
        apiKey: secrets.PERUSE_API_KEY as string,
      };
    } catch (err) {
      this.logger.error(`Could not obtain secrets from ARN ${arn}`, err);
      throw err;
    }
  }
}
