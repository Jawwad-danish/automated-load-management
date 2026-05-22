import { Provider } from '@nestjs/common';
import { SecretsManager, SECRETS_MANAGER } from '@module-aws';
import { ConfigService, CONFIG_SERVICE } from '@module-config';
import {
  TwilioCredentialsService,
  TWILIO_CREDENTIALS_SERVICE,
} from './services';

export const TwilioCredentialServiceProvider: Provider = {
  provide: TWILIO_CREDENTIALS_SERVICE,
  useFactory: async (
    configService: ConfigService,
    secretsManager: SecretsManager,
  ) => {
    const cloudService = new TwilioCredentialsService(
      configService,
      secretsManager,
    );
    await cloudService.fetch();
    return cloudService;
  },
  inject: [CONFIG_SERVICE, SECRETS_MANAGER],
};
