import { BasicCommandHandler } from '@module-cqrs';
import {
  AddressType,
  FactoredStatus,
  LoadEntity,
} from '@module-persistence/entities';
import { LoadRepository } from '@module-persistence/repositories';
import { CommandHandler } from '@nestjs/cqrs';
import { UpdateLoadCommand } from '../update-load.command';
import { ValidationError } from '@core/errors';

@CommandHandler(UpdateLoadCommand)
export class UpdateLoadCommandHandler
  implements BasicCommandHandler<UpdateLoadCommand>
{
  constructor(private readonly repository: LoadRepository) {}

  async execute({
    loadId,
    clientId,
    request,
  }: UpdateLoadCommand): Promise<LoadEntity> {
    const load = await this.repository.getOneByClientAndId(loadId, clientId);
    if (load.factoredStatus === FactoredStatus.Factored) {
      throw new ValidationError('Cannot edit factored load.');
    }
    load.brokerId = request.brokerId ?? load.brokerId;
    load.brokerName = request.brokerName ?? load.brokerName;
    load.loadNumber = request.loadNumber ?? load.loadNumber;
    load.totalAmount = request.totalAmount ?? load.totalAmount;
    load.isRead = request.isRead ?? load.isRead;

    const pickUpLocation = load.addresses
      .getItems()
      .find((address) => address.type === AddressType.Pickup);

    if (pickUpLocation && request.pickUpLocation) {
      const { fullAddress, city, state } = request.pickUpLocation;
      if (fullAddress) pickUpLocation.fullAddress = fullAddress;
      if (city) pickUpLocation.city = city;
      if (state) pickUpLocation.state = state;
    }

    const dropOffLocation = load.addresses
      .getItems()
      .find((address) => address.type === AddressType.Delivery);

    if (dropOffLocation && request.dropOffLocation) {
      const { fullAddress, city, state } = request.dropOffLocation;
      if (fullAddress) dropOffLocation.fullAddress = fullAddress;
      if (city) dropOffLocation.city = city;
      if (state) dropOffLocation.state = state;
    }

    return load;
  }
}
