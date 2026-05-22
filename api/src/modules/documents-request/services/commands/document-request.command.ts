import { Command } from '@module-cqrs';
import { DocumentRequestEntity } from '@module-persistence';

export class SendDocumentRequestCommand extends Command<DocumentRequestEntity> {
  constructor(
    readonly clientId: string,
    readonly loadId: string,
    readonly driverId: string,
  ) {
    super();
  }
}
