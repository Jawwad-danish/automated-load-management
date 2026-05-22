import { PageCriteria, QueryCriteria } from '@core/data';
import { mockMikroORMProvider, mockToken } from '@core/test';
import { DriverRepository } from '@module-persistence/repositories';
import { Test, TestingModule } from '@nestjs/testing';
import { FindDriversQuery } from '../find-drivers.query';
import { FindDriversQueryHandler } from './find-drivers.query-handler';
import { buildStubDriverEntity } from '@module-persistence/test';
import { Loaded } from '@mikro-orm/core';
import { DriverEntity, RecordStatus } from '@module-persistence';

describe('Find Drivers Query Handler', () => {
  let queryHandler: FindDriversQueryHandler;
  let repository: DriverRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FindDriversQueryHandler, mockMikroORMProvider],
    })
      .useMocker((token) => {
        return mockToken(token);
      })
      .compile();

    queryHandler = module.get(FindDriversQueryHandler);
    repository = module.get(DriverRepository);
  });

  it('Should be defined', () => {
    expect(queryHandler).toBeDefined();
  });

  it('Driver repository is called', async () => {
    const criteria: QueryCriteria = {
      filters: [],
      page: new PageCriteria({
        page: 1,
        limit: 10,
      }),
      sort: [],
    };

    const query = new FindDriversQuery('123', criteria);
    const items = buildStubDriverEntity();
    const spy = jest
      .spyOn(repository, 'findByQueryCriteria')
      .mockResolvedValueOnce([[items as Loaded<DriverEntity, string>], 1]);
    const queryResult = await queryHandler.execute(query);

    expect(spy).toHaveBeenCalledWith(query.criteria, {
      additionalWhereClause: {
        recordStatus: RecordStatus.Active,
        clientId: query.clientId,
      },
    });
    expect(queryResult).toEqual({ items: [items], count: 1 });
  });
});
