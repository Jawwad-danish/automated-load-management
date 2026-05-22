import { EntityNotFoundError } from '@core/errors';
import { HttpClient } from '@core/http';
import { AUTH0_M2M_TOKEN_SERVICE, AuthTokenService } from '@module-auth';
import { CONFIG_SERVICE, ConfigService } from '@module-config';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { Client } from '../data';

@Injectable()
export class ClientApi {
  private readonly logger: Logger = new Logger(ClientApi.name);
  private readonly httpClient: HttpClient;
  private readonly url: string;

  constructor(
    @Inject(CONFIG_SERVICE) configService: ConfigService,
    @Inject(AUTH0_M2M_TOKEN_SERVICE) authTokenService: AuthTokenService,
  ) {
    this.httpClient = new HttpClient('client-service', authTokenService);
    const clientServiceUrl = configService.getValue('CLIENT_SERVICE_URL');
    if (!clientServiceUrl.hasValue()) {
      throw new Error(`Could not obtain CLIENT_SERVICE_URL config value`);
    }
    this.url = clientServiceUrl.asString();
  }

  async findById(id: string): Promise<null | Client> {
    this.logger.log(`Fetching client from client service`, { id });
    const result = await this.httpClient.get(`${this.url}/${id}`, {
      nullOnFail: true,
      response: {
        bodyType: Client,
      },
    });
    return result === null ? null : (result as Client);
  }

  async findByEmail(email: string): Promise<null | Client> {
    this.logger.log(`Fetching client from client service`, { email });
    const client = await this.httpClient.get(
      `${this.url}/getByEmail/${email}`,
      {
        nullOnFail: true,
        response: {
          bodyType: Client,
        },
      },
    );
    return client === null ? null : (client as Client);
  }

  async getByEmail(email: string): Promise<Client> {
    const client = await this.findByEmail(email);

    if (client == null) {
      this.logger.error(
        `Could not find client with email ${email} in external service`,
      );
      throw new EntityNotFoundError(
        'Could not find client in external service',
      );
    }
    return client;
  }

  async getById(id: string): Promise<Client> {
    const client = await this.findById(id);
    if (client == null) {
      throw new EntityNotFoundError(
        'Could not find client in external service',
      );
    }
    return client;
  }

  async findByIds(ids: string[]): Promise<Client[]> {
    this.logger.log(`Fetching clients from client service`, { ids });
    if (ids.length === 0) {
      return [];
    }
    if (ids.length === 1) {
      const result = await this.findById(ids[0]);
      return result !== null ? [result] : [];
    }

    const queryParams = ids.map((id) => `id=${id}`).join('&');
    const result = await this.httpClient.get(
      `${this.url}/getByIds/id?${queryParams}`,
      {
        response: { bodyType: Client },
      },
    );
    return result as Client[];
  }
}
