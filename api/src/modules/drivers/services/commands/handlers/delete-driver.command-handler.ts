import { EntityNotFoundError } from '@core/errors';
import { BasicCommandHandler } from '@module-cqrs';
import { RecordStatus } from '@module-persistence/entities';
import { DriverRepository } from '@module-persistence/repositories';
import { CommandHandler } from '@nestjs/cqrs';
import { DeleteDriverCommand } from '../delete-driver.command';

@CommandHandler(DeleteDriverCommand)
export class DeleteDriverCommandHandler
  implements BasicCommandHandler<DeleteDriverCommand>
{
  constructor(private readonly repository: DriverRepository) {}

  async execute({ driverId, clientId }: DeleteDriverCommand): Promise<void> {
    const entity = await this.repository.findOne({
      id: driverId,
      clientId: clientId,
      recordStatus: RecordStatus.Active,
    });
    if (entity == null) {
      throw new EntityNotFoundError(
        `Driver with id [${driverId} does not exist]`,
      );
    }
    entity.recordStatus = RecordStatus.Inactive;
  }
}
