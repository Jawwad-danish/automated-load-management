import { CauseAwareError, Reason } from '@core';

export class UserNotFoundError extends CauseAwareError {
  constructor(key: string, value: string, causingError: Error) {
    super(
      'client-not-found',
      `Could not find client with ${key} ${value}`,
      causingError,
    );
  }

  getReason(): Reason {
    return Reason.Missing;
  }
}
