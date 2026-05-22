import { environment } from '@core/environment';
import { SECRETS_MANAGER, SecretsManager } from '@module-aws';
import { CONFIG_SERVICE, ConfigService } from '@module-config';
import { Provider } from '@nestjs/common';
import { CloudM2MTokenService } from './cloud-m2m-token.service';
import { LocalM2MTokenService } from './local-m2m-token.service';

export const AUTH0_M2M_TOKEN_SERVICE = 'Auth0M2MTokenService';

export const m2MTokenServiceProvider: Provider = {
  provide: AUTH0_M2M_TOKEN_SERVICE,
  useFactory: async (
    configService: ConfigService,
    secretsManager: SecretsManager,
  ) => {
    if (
      environment.isLocal() ||
      environment.isTest() ||
      environment.isIntegration()
    ) {
      return new LocalM2MTokenService();
    }
    const cloudTokenProvider = new CloudM2MTokenService(
      configService,
      secretsManager,
    );
    await cloudTokenProvider.load();
    return cloudTokenProvider;
  },
  inject: [CONFIG_SERVICE, SECRETS_MANAGER],
};
