import { Injectable } from '@nestjs/common';
import { Client } from '../data';

import { ClientApi } from '../api';

@Injectable()
export class ClientService {
  constructor(private readonly clientApi: ClientApi) {}

  async getClientByEmail(email: string): Promise<Client> {
    return await this.clientApi.getByEmail(email);
  }
}
