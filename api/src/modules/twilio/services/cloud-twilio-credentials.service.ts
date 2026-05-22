import { SecretsManager } from '@module-aws';
import { ConfigService } from '@module-config';
import {
  TwilioCredentials,
  TwilioCredentialService,
} from './twilio-credentials.service';

const VALUE_TO_OBSERVE = 'TWILIO_ACCOUNT_SECRET_ARN';

export class TwilioCredentialsService implements TwilioCredentialService {
  private twilioCredentials: TwilioCredentials;

  constructor(
    private configService: ConfigService,
    private readonly secretsManager: SecretsManager,
  ) {}

  getCredentials(): TwilioCredentials {
    return this.twilioCredentials;
  }

  async fetch() {
    const config = this.configService.getValue(VALUE_TO_OBSERVE);
    const secrets = await this.secretsManager.fromARN(config.asString());
    this.twilioCredentials = {
      twilioAccountSid: secrets.TWILIO_ACCOUNT_SID as string,
      twilioAccountAuthToken: secrets.TWILIO_ACCOUNT_AUTH_TOKEN as string,
      twilioDefaultFromNumber: secrets.TWILIO_DEFAULT_FROM_NUMBER as string,
      twilioMessageLoadManagementUrl: secrets.TWILIO_MESSAGE_LOAD_URL as string,
    };
  }
}
