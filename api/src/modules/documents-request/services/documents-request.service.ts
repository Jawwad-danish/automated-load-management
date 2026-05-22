import { AppContextHolder, CrossCuttingConcerns } from '@core';
import { CommandRunner } from '@module-cqrs';
import { Transactional } from '@module-database';
import { DocumentRequestEntity } from '@module-persistence';
import { Injectable } from '@nestjs/common';
import { SendDocumentRequestCommand } from './commands';
import { SegmentEvents, SegmentService } from '@module-segment';

@Injectable()
export class DocumentsRequestService {
  constructor(
    private readonly commandRunner: CommandRunner,
    private readonly analytics: SegmentService,
  ) {}

  @CrossCuttingConcerns<DocumentsRequestService, 'sendRequest'>({
    logging: (clientId: string, loadId: string, driverData: string) => {
      return {
        message: 'Send request for document upload',
        payload: {
          clientId,
          loadId,
          driverData,
        },
      };
    },
  })
  @Transactional('send-request')
  async sendRequest(
    clientId: string,
    loadId: string,
    driverId: string,
  ): Promise<DocumentRequestEntity> {
    const documentRequestEntitiy: DocumentRequestEntity =
      await this.commandRunner.run(
        new SendDocumentRequestCommand(clientId, loadId, driverId),
      );
    if (documentRequestEntitiy) {
      this.analytics.track(
        documentRequestEntitiy.load.email.fromEmail,
        SegmentEvents.DocumentRequested,
        {
          driverName: documentRequestEntitiy.driverName,
          driverPhoneNumber: documentRequestEntitiy.driverPhoneNumber,
          loadId: documentRequestEntitiy.load.id,
          brokerName: documentRequestEntitiy.load.brokerName,
          appType: AppContextHolder.get().consumer,
        },
      );
    }
    return documentRequestEntitiy;
  }
}
