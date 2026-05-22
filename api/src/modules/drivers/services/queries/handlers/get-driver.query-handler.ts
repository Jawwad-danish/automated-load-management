import { DriverRepository } from '@module-persistence/repositories';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetDriverQuery } from '../get-driver.query';
import { DriverEntity, RecordStatus } from '@module-persistence';

@QueryHandler(GetDriverQuery)
export class GetDriverQueryHandler
  implements IQueryHandler<GetDriverQuery, DriverEntity | null>
{
  constructor(private driverRepository: DriverRepository) {}

  async execute(query: GetDriverQuery): Promise<DriverEntity | null> {
    return this.driverRepository.findOne({
      id: query.id,
      clientId: query.clientId,
      recordStatus: RecordStatus.Active,
    });
  }
}
