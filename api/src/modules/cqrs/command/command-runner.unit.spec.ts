import { mockToken } from '@core/test';
import { CommandBus } from '@nestjs/cqrs';
import { Test, TestingModule } from '@nestjs/testing';
import { CommandRunner } from './command-runner';
import { Command } from './data';

class TestCommand extends Command<object> {
  constructor() {
    super();
  }
}

describe('Command runner', () => {
  let commandRunner: CommandRunner;
  let commandBus: CommandBus;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CommandRunner],
    })
      .useMocker((token) => {
        return mockToken(token);
      })
      .compile();

    commandRunner = module.get(CommandRunner);
    commandBus = module.get(CommandBus);
  });

  it('Command runner should be defined', () => {
    expect(commandRunner).toBeDefined();
  });

  it('Command bus is called', async () => {
    const executeSpy = jest.spyOn(commandBus, 'execute');
    executeSpy.mockResolvedValueOnce({});

    await commandRunner.run(new TestCommand());

    expect(executeSpy).toHaveBeenCalledTimes(1);
  });
});
