import { mockMikroORMProvider, mockToken } from '@core/test';
import { DriverEntity, RecordStatus } from '@module-persistence';
import { DriverRepository } from '@module-persistence/repositories';
import { Test, TestingModule } from '@nestjs/testing';
import { GetDriverQuery } from '../get-driver.query';
import { GetDriverQueryHandler } from './get-driver.query-handler';

describe('Get Driver Query Handler', () => {
  let queryHandler: GetDriverQueryHandler;
  let repository: DriverRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GetDriverQueryHandler, mockMikroORMProvider],
    })
      .useMocker((token) => {
        return mockToken(token);
      })
      .compile();

    queryHandler = module.get(GetDriverQueryHandler);
    repository = module.get(DriverRepository);
  });

  it('Should be defined', () => {
    expect(queryHandler).toBeDefined();
  });

  it('Driver repository is called', async () => {
    const query = new GetDriverQuery('123', '456');
    const findOneSpy = jest
      .spyOn(repository, 'findOne')
      .mockResolvedValue(new DriverEntity());
    await queryHandler.execute(query);
    expect(findOneSpy).toHaveBeenCalledWith({
      id: query.id,
      clientId: query.clientId,
      recordStatus: RecordStatus.Active,
    });
  });

  it('should return null when driver is not found', async () => {
    const query = new GetDriverQuery('123', '456');
    const findOneSpy = jest
      .spyOn(repository, 'findOne')
      .mockResolvedValue(null);

    const result = await queryHandler.execute(query);
    expect(result).toBeNull();
    expect(findOneSpy).toHaveBeenCalledWith({
      id: query.id,
      clientId: query.clientId,
      recordStatus: RecordStatus.Active,
    });
  });
});
