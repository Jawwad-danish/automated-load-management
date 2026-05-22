import { CrossCuttingConcerns } from '@core/util';
import { Injectable, Logger } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { Command } from './data';

@Injectable()
export class CommandRunner {
  logger: Logger = new Logger(CommandRunner.name);

  constructor(private readonly commandBus: CommandBus) {}

  @CrossCuttingConcerns({
    logging: (command: Command<any>) => {
      return {
        message: `Command ${command.getName()}`,
      };
    },
  })
  async run<TResult>(command: Command<TResult>): Promise<TResult> {
    let result: TResult;
    try {
      result = await this.commandBus.execute<Command<TResult>, TResult>(
        command,
      );
      command.setResult(result);
    } catch (error) {
      throw error;
    }

    return result;
  }
}
