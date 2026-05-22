import { Command } from '@module-cqrs';
import { LoadEntity } from '@module-persistence';
import { UpdateLoadRequest } from '../../data';

export class UpdateLoadCommand extends Command<LoadEntity> {
  constructor(
    readonly loadId: string,
    readonly clientId: string,
    readonly request: UpdateLoadRequest,
  ) {
    super();
  }
}
