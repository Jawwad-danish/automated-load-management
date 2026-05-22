import { Injectable, Logger } from '@nestjs/common';
import { BrokerApi } from '../api';
import { Broker } from '../data/model';

@Injectable()
export class BrokerService {
  logger: Logger = new Logger(BrokerService.name);

  constructor(private readonly brokerApi: BrokerApi) {}

  async findOneByID(id: string): Promise<null | Broker> {
    return await this.brokerApi.findByID(id);
  }

  async findOneByMC(mc: string): Promise<null | Broker> {
    const result = await this.brokerApi.findByMC(mc);
    return result === null ? null : result[0];
  }

  async findOneByDOT(dot: string): Promise<null | Broker> {
    const result = await this.brokerApi.findByDOT(dot);
    return result === null ? null : result[0];
  }

  async findByName(name: string): Promise<null | Broker[]> {
    return await this.brokerApi.findByName(name);
  }
}
