import { BasicCommandHandler } from '@module-cqrs';
import { DriverEntity } from '@module-persistence/entities';
import { DriverRepository } from '@module-persistence/repositories';
import { CommandHandler } from '@nestjs/cqrs';
import { UpdateDriverCommand } from '../update-driver.command';
import { EntityNotFoundError } from '@core/errors';

@CommandHandler(UpdateDriverCommand)
export class UpdateDriverCommandHandler
  implements BasicCommandHandler<UpdateDriverCommand>
{
  constructor(private readonly repository: DriverRepository) {}

  async execute({
    clientId,
    driverId,
    request,
  }: UpdateDriverCommand): Promise<DriverEntity> {
    const entity = await this.repository.findOne({
      id: driverId,
      clientId: clientId,
    });

    if (!entity) {
      throw EntityNotFoundError.byId(driverId, 'Driver');
    }

    if (request.name) {
      entity.name = request.name;
    }

    if (request.phoneNumber) {
      entity.phoneNumber = request.phoneNumber;
    }

    return entity;
  }
}
