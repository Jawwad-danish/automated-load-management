import { Command } from '@module-cqrs';

export class DeleteDriverCommand extends Command<void> {
  constructor(
    readonly driverId: string,
    readonly clientId: string,
  ) {
    super();
  }
}
