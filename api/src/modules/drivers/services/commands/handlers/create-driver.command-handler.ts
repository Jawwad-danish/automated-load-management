import { BasicCommandHandler } from '@module-cqrs';
import { DriverEntity } from '@module-persistence/entities';
import { DriverRepository } from '@module-persistence/repositories';
import { CommandHandler } from '@nestjs/cqrs';
import { DriverMapper } from '../../../data';
import { CreateDriverCommand } from '../create-driver.command';

@CommandHandler(CreateDriverCommand)
export class CreateDriverCommandHandler
  implements BasicCommandHandler<CreateDriverCommand>
{
  constructor(
    private readonly repository: DriverRepository,
    private readonly mapper: DriverMapper,
  ) {}

  async execute(command: CreateDriverCommand): Promise<DriverEntity> {
    const entity = await this.mapper.createRequestToEntity(command.request);
    entity.clientId = command.clientId;
    this.repository.persist(entity);
    return entity;
  }
}
