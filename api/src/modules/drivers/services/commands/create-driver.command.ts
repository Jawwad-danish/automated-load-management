import { Command } from '@module-cqrs';
import { CreateDriverRequest } from '../../data';
import { DriverEntity } from '@module-persistence';

export class CreateDriverCommand extends Command<DriverEntity> {
  constructor(
    readonly request: CreateDriverRequest,
    readonly clientId: string,
  ) {
    super();
  }
}
