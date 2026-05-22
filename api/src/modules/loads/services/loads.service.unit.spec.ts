import { mockMikroORMProvider, mockToken } from '@core/test';
import {
  FactoredStatus,
  LoadRepository,
  RecordStatus,
} from '@module-persistence';
import { buildStubLoadEntity } from '@module-persistence/test';
import { Test, TestingModule } from '@nestjs/testing';
import { FactorLoadRequest } from '../data';
import { LoadsService } from './loads.service';

describe('LoadsService', () => {
  let loadsService: LoadsService;
  let loadRepository: LoadRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [mockMikroORMProvider, LoadsService],
    })
      .useMocker((token) => {
        return mockToken(token);
      })
      .compile();

    loadsService = module.get(LoadsService);
    loadRepository = module.get(LoadRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('Should be defined', () => {
    expect(loadsService).toBeDefined();
  });

  it('When deleting load', async () => {
    const deleteSpy = jest.spyOn(loadsService, 'delete');
    const load = buildStubLoadEntity();
    jest
      .spyOn(loadRepository, 'getOneByClientAndId')
      .mockResolvedValueOnce(load);

    await loadsService.delete('client-id', 'load-id');

    expect(deleteSpy).toHaveBeenCalledTimes(1);
    expect(load.recordStatus).toBe(RecordStatus.Inactive);
  });

  it('When deleting factored load ', async () => {
    const load = buildStubLoadEntity();

    // Simulate a factored load that would trigger the error
    load.factoredStatus = FactoredStatus.Factored;

    jest
      .spyOn(loadRepository, 'getOneByClientAndId')
      .mockResolvedValueOnce(load);

    await expect(loadsService.delete('client-id', 'load-id')).rejects.toThrow(
      'Cannot delete factored load.',
    );
    expect(load.recordStatus).toBe(RecordStatus.Active);
  });

  it('When factoring load', async () => {
    const load = buildStubLoadEntity();
    jest
      .spyOn(loadRepository, 'getOneByClientAndId')
      .mockResolvedValueOnce(load);

    await loadsService.factor(
      'client-id',
      'load-id',
      new FactorLoadRequest({
        invoiceId: 'invoice-id',
      }),
    );

    expect(load.invoiceId).toBe('invoice-id');
    expect(load.factoredStatus).toBe(FactoredStatus.Factored);
  });
});
