import { EntityNotFoundError } from '@core/errors';
import { mockToken } from '@core/test';
import { RecordStatus } from '@module-persistence/entities';
import { DriverRepository } from '@module-persistence/repositories';
import { buildStubDriverEntity } from '@module-persistence/test';
import { Test, TestingModule } from '@nestjs/testing';
import { DeleteDriverCommand } from '../delete-driver.command';
import { DeleteDriverCommandHandler } from './delete-driver.command-handler';

describe('DeleteDocumentCommandHandler', () => {
  let repository: DriverRepository;
  let handler: DeleteDriverCommandHandler;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DeleteDriverCommandHandler],
    })
      .useMocker((token) => {
        return mockToken(token);
      })
      .compile();

    repository = module.get(DriverRepository);
    handler = module.get(DeleteDriverCommandHandler);
  });

  it('Should be defined', () => {
    expect(handler).toBeDefined();
  });

  it('When no driver is found, exception is thrown', async () => {
    jest.spyOn(repository, 'findOne').mockResolvedValueOnce(null);

    expect(
      handler.execute(new DeleteDriverCommand('driver-id', 'client-id')),
    ).rejects.toThrow(EntityNotFoundError);
  });

  it('When driver is found, record status is set to inactive', async () => {
    const driver = buildStubDriverEntity();
    jest.spyOn(repository, 'findOne').mockResolvedValueOnce(driver);

    await handler.execute(new DeleteDriverCommand('driver-id', 'client-id'));

    expect(driver.recordStatus).toBe(RecordStatus.Inactive);
  });
});
