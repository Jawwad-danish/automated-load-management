import { BasicCommandHandler } from '@module-cqrs';
import {
  DocumentRequestRepository,
  LoadRepository,
  DriverRepository,
  DriverEntity,
  LoadEntity,
  DocumentRequestStatus,
  DocumentStatus,
} from '@module-persistence';
import { CommandHandler } from '@nestjs/cqrs';
import { TwilioService } from '@module-twilio';
import { SendDocumentRequestCommand } from '../document-request.command';
import { DocumentRequestEntity } from '@module-persistence';
import { AddressType } from '@module-persistence';
import { v4 } from 'uuid';

@CommandHandler(SendDocumentRequestCommand)
export class DocumentRequestCommandHandler
  implements BasicCommandHandler<SendDocumentRequestCommand>
{
  constructor(
    private readonly documentRequestRepository: DocumentRequestRepository,
    private readonly loadRepository: LoadRepository,
    private readonly driverRepository: DriverRepository,
    private readonly twilioService: TwilioService,
  ) {}

  async execute(
    command: SendDocumentRequestCommand,
  ): Promise<DocumentRequestEntity> {
    const { clientId, loadId, driverId } = command;

    const driver = await this.driverRepository.getOneById(driverId);
    const load = await this.loadRepository.getOneByClientAndId(
      loadId,
      clientId,
    );

    const documentRequest = this.createDocumentRequestEntity(driver, load);

    const url = await this.notifyDriver(
      driver.phoneNumber,
      load,
      documentRequest.id,
    );

    documentRequest.url = url;
    load.documentStatus = DocumentStatus.DocRequested;
    await this.documentRequestRepository.persistAndFlush(documentRequest);

    return documentRequest;
  }

  private async notifyDriver(
    driverPhoneNumber: string,
    load: LoadEntity,
    documentRequestId: string,
  ) {
    const deliveryAddress = load.addresses.find(
      (address) => address.type === AddressType.Delivery,
    );

    let url = this.twilioService.getUrl();

    url += documentRequestId;

    if (deliveryAddress) {
      const message = `Please upload the documents for ${deliveryAddress.city}, ${deliveryAddress.state} load # ${load.loadNumber} \n ${url}`;
      await this.twilioService.sendMessage(driverPhoneNumber, message);
    } else {
      const message = `Please upload the documents for load # ${load.loadNumber} \n ${url}`;
      await this.twilioService.sendMessage(driverPhoneNumber, message);
    }
    return url;
  }

  private createDocumentRequestEntity(
    driver: DriverEntity,
    load: LoadEntity,
  ): DocumentRequestEntity {
    const documentRequest = new DocumentRequestEntity();
    documentRequest.id = v4();
    documentRequest.driverId = driver.id;
    documentRequest.driverName = driver.name;
    documentRequest.driverPhoneNumber = driver.phoneNumber;
    documentRequest.load = load;
    documentRequest.status = DocumentRequestStatus.Sent;

    return documentRequest;
  }
}
