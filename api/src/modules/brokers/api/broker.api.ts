import { HttpClient } from '@core/http';
import { AUTH0_M2M_TOKEN_SERVICE, AuthTokenService } from '@module-auth';
import { CONFIG_SERVICE, ConfigService } from '@module-config';
import { Inject, Injectable } from '@nestjs/common';
import { Broker } from '../data/model';
import { FilterOperator } from '@core/data';

@Injectable()
export class BrokerApi {
  private readonly httpClient: HttpClient;
  private readonly url: string;

  constructor(
    @Inject(CONFIG_SERVICE) configService: ConfigService,
    @Inject(AUTH0_M2M_TOKEN_SERVICE) authTokenService: AuthTokenService,
  ) {
    this.httpClient = new HttpClient('broker-service', authTokenService);
    const brokerServiceUrl = configService.getValue('BROKER_SERVICE_URL');
    if (!brokerServiceUrl.hasValue()) {
      throw new Error('Could not obtain BROKER_SERVICE_URL config value');
    }
    this.url = brokerServiceUrl.asString();
  }

  async findByID(id: string): Promise<Broker | null> {
    const result = await this.httpClient.get(`${this.url}/${id}`, {
      nullOnFail: true,
      response: {
        bodyType: Broker,
      },
    });

    return result === null ? null : (result as Broker);
  }

  async findByMC(mc: string): Promise<Broker[] | null> {
    return await this.findByAttribute('mc', mc, FilterOperator.IN);
  }

  async findByDOT(dot: string): Promise<Broker[] | null> {
    return await this.findByAttribute('dot', dot, FilterOperator.IN);
  }

  async findByName(name: string): Promise<Broker[] | null> {
    return await this.findByAttribute('legalName', name, FilterOperator.ILIKE);
  }

  private async findByAttribute(
    key: string,
    value: string,
    operator: FilterOperator,
  ): Promise<null | Broker[]> {
    const result = await this.httpClient.get(
      `${this.url}/?filter=${key}:${operator}:[${value}]`,
      {
        nullOnFail: true,
        response: {
          bodyType: Broker,
        },
      },
    );

    return result === null ? null : (result as Broker[]);
  }
}
