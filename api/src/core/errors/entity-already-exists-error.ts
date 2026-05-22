import { CauseAwareError, Reason } from './cause-aware-error';

export class EntityAlreadyExists extends CauseAwareError {
  name: string = EntityAlreadyExists.name;

  constructor(message: string) {
    super('entity-conflict', message);
  }

  getReason(): Reason {
    return Reason.Conflict;
  }
}
