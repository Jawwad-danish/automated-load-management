import { SECRETS_MANAGER, SecretsManager } from '@module-aws';
import { ConfigService, CONFIG_SERVICE } from '@module-config';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { AuthenticationClient, TokenSet } from 'auth0';
import dayjs from 'dayjs';
import { AuthTokenService } from './token.service';

interface TokenData {
  accessToken: string;
  refreshToken?: string;
  expiresAt: dayjs.Dayjs;
}
@Injectable()
export class CloudM2MTokenService implements AuthTokenService {
  private readonly logger: Logger = new Logger(CloudM2MTokenService.name);
  private authClient: AuthenticationClient;
  private audience: string;
  private tokenData?: TokenData;

  constructor(
    @Inject(CONFIG_SERVICE) private readonly configService: ConfigService,
    @Inject(SECRETS_MANAGER) private readonly secretsManager: SecretsManager,
  ) {}

  async load() {
    const config = this.configService.getValue('AUTH0_SECRET_ARN');
    const arn = config.asString();
    try {
      const secrets = await this.secretsManager.fromARN(arn);
      this.authClient = new AuthenticationClient({
        domain: secrets.AUTH0_M2M_DOMAIN as string,
        clientId: secrets.AUTH0_M2M_CLIENT_ID as string,
        clientSecret: secrets.AUTH0_M2M_CLIENT_SECRET as string,
      });
      this.audience = secrets.AUTH0_M2M_AUDIENCE as string;
    } catch (error) {
      this.logger.error(`Could not obtain secrets from ARN ${arn}`, error);
      throw error;
    }
    await this.loadTokenData();
  }

  private async loadTokenData(): Promise<void> {
    this.logger.log('Retrieving token for M2M');
    let response: TokenSet;
    if (this.tokenData?.refreshToken) {
      ({ data: response } = await this.authClient.oauth.refreshTokenGrant({
        refresh_token: this.tokenData.refreshToken,
      }));
    } else {
      ({ data: response } = await this.authClient.oauth.clientCredentialsGrant({
        audience: this.audience,
      }));
    }

    this.tokenData = {
      accessToken: response.access_token,
      refreshToken: response.refresh_token,
      // subtract 10 seconds to make up for a potentially slow response from auth0
      expiresAt: dayjs().add(response.expires_in - 10, 'seconds'),
    };
  }

  async getAccessToken(): Promise<string> {
    if (!this.tokenData || this.tokenData.expiresAt < dayjs()) {
      await this.loadTokenData();
    }

    return this.tokenData?.accessToken as string;
  }
}
