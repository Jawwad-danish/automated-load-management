import { EntityNotFoundError } from '@core/errors';
import { mockToken } from '@core/test';
import { DriverRepository } from '@module-persistence/repositories';
import { buildStubDriverEntity } from '@module-persistence/test';
import { Test, TestingModule } from '@nestjs/testing';
import { UpdateDriverRequest } from '../../../data';
import { UpdateDriverCommand } from '../update-driver.command';
import { UpdateDriverCommandHandler } from './update-driver.command-handler';

describe('CreateDriverCommandHandler', () => {
  let handler: UpdateDriverCommandHandler;
  let repository: DriverRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UpdateDriverCommandHandler],
    })
      .useMocker((token) => {
        return mockToken(token);
      })
      .compile();

    handler = module.get<UpdateDriverCommandHandler>(
      UpdateDriverCommandHandler,
    );
    repository = module.get<DriverRepository>(DriverRepository);
  });

  it('should update the driver entity successfully', async () => {
    const payload: UpdateDriverRequest = {
      name: 'Bruce Wayne',
      phoneNumber: '+911911911',
    };
    const command = new UpdateDriverCommand('123', '456', payload);

    const entity = buildStubDriverEntity();

    jest.spyOn(repository, 'findOne').mockResolvedValueOnce(entity);

    const result = await handler.execute(command);

    expect(repository.findOne).toHaveBeenCalledWith({
      id: command.driverId,
      clientId: command.clientId,
    });
    expect(entity.name).toBe('Bruce Wayne');
    expect(entity.phoneNumber).toBe('+911911911');
    expect(result).toBe(entity);
  });

  it('should throw EntityNotFoundError if the driver entity is not found', async () => {
    const payload: UpdateDriverRequest = {
      name: 'Bruce Wayne',
      phoneNumber: '+911911911',
    };
    const command = new UpdateDriverCommand('123', '456', payload);

    jest.spyOn(repository, 'findOne').mockResolvedValueOnce(null);

    await expect(handler.execute(command)).rejects.toThrow(
      EntityNotFoundError.byId(command.driverId, 'Driver'),
    );
    expect(repository.findOne).toHaveBeenCalledWith({
      id: command.driverId,
      clientId: command.clientId,
    });
  });

  it('should update only the provided fields', async () => {
    const payload: UpdateDriverRequest = {
      name: 'Bruce Wayne',
    };
    const command = new UpdateDriverCommand('123', '456', payload);

    const entity = buildStubDriverEntity({ phoneNumber: '987654321' });

    jest.spyOn(repository, 'findOne').mockResolvedValueOnce(entity);
    jest.spyOn(repository, 'persist').mockImplementation();

    const result = await handler.execute(command);

    expect(repository.findOne).toHaveBeenCalledWith({
      id: command.driverId,
      clientId: command.clientId,
    });
    expect(entity.name).toBe('Bruce Wayne');
    expect(entity.phoneNumber).toBe('987654321');
    expect(result).toBe(entity);
  });
});
