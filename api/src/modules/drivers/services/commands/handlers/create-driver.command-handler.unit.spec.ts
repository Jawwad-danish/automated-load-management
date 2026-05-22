import { Test, TestingModule } from '@nestjs/testing';
import { DriverRepository } from '@module-persistence/repositories';
import { CreateDriverCommand } from '../create-driver.command';
import { CreateDriverRequest, DriverMapper } from '../../../data';
import { DriverEntity } from '@module-persistence/entities';
import { CreateDriverCommandHandler } from './create-driver.command-handler';
import { mockToken } from '@core/test';

describe('CreateDriverCommandHandler', () => {
  let handler: CreateDriverCommandHandler;
  let repository: DriverRepository;
  let mapper: DriverMapper;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CreateDriverCommandHandler],
    })
      .useMocker((token) => {
        return mockToken(token);
      })
      .compile();

    handler = module.get<CreateDriverCommandHandler>(
      CreateDriverCommandHandler,
    );
    mapper = module.get<DriverMapper>(DriverMapper);
    repository = module.get<DriverRepository>(DriverRepository);
  });

  it('should be defined', () => {
    expect(handler).toBeDefined();
  });

  it('should call repository.persist with a new DriverEntity', async () => {
    const request: CreateDriverRequest = {
      name: 'John Doe',
      phoneNumber: '+401234567890',
    };
    const command = new CreateDriverCommand(request, 'client-123');

    const expectedEntity = new DriverEntity();
    expectedEntity.name = request.name;
    expectedEntity.phoneNumber = request.phoneNumber;

    jest
      .spyOn(mapper, 'createRequestToEntity')
      .mockResolvedValueOnce(expectedEntity);

    await handler.execute(command);

    expect(repository.persist).toHaveBeenCalledWith(
      expect.objectContaining({
        name: expectedEntity.name,
        phoneNumber: expectedEntity.phoneNumber,
        clientId: expectedEntity.clientId,
      }),
    );
  });
});
