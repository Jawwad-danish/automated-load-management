import { Inject, Logger, Injectable } from '@nestjs/common';
import { SECRETS_MANAGER, SecretsManager } from '@module-aws';
import { CONFIG_SERVICE, ConfigService } from '@module-config';

export type SegmentCredentials = {
  writeKey: string;
  enable: boolean;
};

@Injectable()
export class SegmentCredentialsService {
  private readonly logger: Logger = new Logger(SegmentCredentialsService.name);

  constructor(
    @Inject(CONFIG_SERVICE) private readonly configService: ConfigService,
    @Inject(SECRETS_MANAGER) private readonly secretsManager: SecretsManager,
  ) {}

  async getCredentials(): Promise<SegmentCredentials> {
    const writeKeyArn = this.configService
      .getValue('SEGMENT_WRITE_KEY_SECRET_ARN')
      .asString();
    const enable = this.configService.getValue('SEGMENT_ENABLED').asBoolean();
    try {
      const secrets = await this.secretsManager.fromARN(writeKeyArn);
      if ('SEGMENT_WRITE_KEY' in secrets === false) {
        this.logger.error(
          `Could not read SEGMENT_WRITE_KEY from ARN ${writeKeyArn}`,
        );
      }
      return {
        writeKey: secrets.SEGMENT_WRITE_KEY as string,
        enable: enable,
      };
    } catch (err) {
      this.logger.error(`Could not read segmant configs, reason: `, err);
      throw err;
    }
  }
}
