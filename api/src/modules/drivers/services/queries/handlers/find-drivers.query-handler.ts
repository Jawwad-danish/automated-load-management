import { DriverRepository } from '@module-persistence/repositories';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import {
  FindDriversQuery,
  FindDriversQueryResult,
} from '../find-drivers.query';
import { RecordStatus } from '@module-persistence';

@QueryHandler(FindDriversQuery)
export class FindDriversQueryHandler
  implements IQueryHandler<FindDriversQuery, FindDriversQueryResult>
{
  constructor(private driverRepository: DriverRepository) {}

  async execute(query: FindDriversQuery): Promise<FindDriversQueryResult> {
    const [items, count] = await this.driverRepository.findByQueryCriteria(
      query.criteria,
      {
        additionalWhereClause: {
          recordStatus: RecordStatus.Active,
          clientId: query.clientId,
        },
      },
    );
    return { items, count };
  }
}
