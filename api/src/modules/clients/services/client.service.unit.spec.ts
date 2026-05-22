import { mockMikroORMProvider, mockToken } from '@core/test';
import { Test, TestingModule } from '@nestjs/testing';
import { ClientApi } from '../api';
import { ClientService } from './client.service';

describe('ClientService', () => {
  let clientService: ClientService;
  let clientApi: ClientApi;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [mockMikroORMProvider, ClientService],
    })
      .useMocker((token) => {
        return mockToken(token);
      })
      .compile();

    clientService = module.get(ClientService);
    clientApi = module.get(ClientApi);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('Should be defined', () => {
    expect(clientService).toBeDefined();
    expect(clientApi).toBeDefined();
  });
});
