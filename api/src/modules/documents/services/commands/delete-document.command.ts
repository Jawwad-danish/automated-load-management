import { Command } from '@module-cqrs';

export class DeleteDocumentCommand extends Command<void> {
  constructor(
    readonly clientId: string,
    readonly loadId: string,
    readonly documentId: string,
  ) {
    super();
  }
}
