import { CONFIG_SERVICE, ConfigService } from '@module-config';
import { Provider } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Auth0CredentialsService } from '../credentials';
import { AnonymousStrategy } from './anonymous-strategy';
import { Auth0Strategy } from './auth0-strategy';

export const strategyProvider: Provider = {
  provide: PassportStrategy,
  useFactory: async (
    configService: ConfigService,
    auth0CredentialsService: Auth0CredentialsService,
  ) => {
    const securityStrategy = configService.getValue('JWT_SECURITY_STRATEGY');
    if (securityStrategy) {
      switch (securityStrategy.asString()) {
        case 'anonymous':
          return new AnonymousStrategy();

        case 'auth0':
        default:
          const auth0Credentials = await auth0CredentialsService.get();
          return new Auth0Strategy(auth0Credentials);
      }
    }
    const auth0Credentials = await auth0CredentialsService.get();
    return new Auth0Strategy(auth0Credentials);
  },
  inject: [CONFIG_SERVICE, Auth0CredentialsService],
};
