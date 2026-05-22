import {
  GetSecretValueCommand,
  SecretsManagerClient,
} from '@aws-sdk/client-secrets-manager';
import { environment } from '@core/environment';
import { ErrorFactory } from '@core/errors';
import { Logger } from '@nestjs/common';
import { SecretsManager } from './secrets-manager';

export class CloudSecretsManager implements SecretsManager {
  private readonly client = new SecretsManagerClient({
    region: environment.aws.defaultRegion(),
  });
  private readonly logger: Logger = new Logger(CloudSecretsManager.name);

  async fromARN(arn: string): Promise<Record<string, unknown>> {
    const command = new GetSecretValueCommand({ SecretId: arn });
    const result = await this.client.send(command);
    if (result.SecretString) {
      try {
        return JSON.parse(result.SecretString);
      } catch (error) {
        this.logger.error(
          `Could not parse SecretString from AWS Secrets Manager for arn ${arn}`,
        );
        throw error;
      }
    } else {
      this.logger.error(
        `Could not read SecretString from AWS Secrets Manager for arn ${arn}`,
      );
      throw ErrorFactory.notFound('Secret', 'SecretString', arn);
    }
  }
}
