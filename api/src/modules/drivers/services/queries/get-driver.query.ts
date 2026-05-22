import { Query } from '@module-cqrs';
import { DriverEntity } from '@module-persistence';

export class GetDriverQuery extends Query<DriverEntity | null> {
  constructor(
    readonly id: string,
    readonly clientId: string,
  ) {
    super();
  }
}
