import { Query } from '@module-cqrs';
import { DriverEntity } from '@module-persistence';
import { QueryCriteria } from '@core/data';

export interface FindDriversQueryResult {
  items: DriverEntity[];
  count: number;
}

export class FindDriversQuery extends Query<FindDriversQueryResult> {
  constructor(
    readonly clientId: string,
    readonly criteria: QueryCriteria,
  ) {
    super();
  }
}
