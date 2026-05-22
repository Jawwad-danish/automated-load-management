import { Command } from '@module-cqrs';
import { DriverEntity } from '@module-persistence';
import { UpdateDriverRequest } from '../../data';

export class UpdateDriverCommand extends Command<DriverEntity> {
  constructor(
    readonly driverId: string,
    readonly clientId: string,
    readonly request: UpdateDriverRequest,
  ) {
    super();
  }
}
