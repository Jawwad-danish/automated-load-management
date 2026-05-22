import { EntityNotFoundError } from '@core/errors';
import { BasicCommandHandler } from '@module-cqrs';
import { RecordStatus } from '@module-persistence/entities';
import { DocumentRepository } from '@module-persistence/repositories';
import { CommandHandler } from '@nestjs/cqrs';
import { DeleteDocumentCommand } from '../delete-document.command';

@CommandHandler(DeleteDocumentCommand)
export class DeleteDocumentCommandHandler
  implements BasicCommandHandler<DeleteDocumentCommand>
{
  constructor(private readonly repository: DocumentRepository) {}

  async execute({ loadId, documentId }: DeleteDocumentCommand): Promise<void> {
    const document = await this.repository.findInLoad(loadId, documentId);
    if (document == null) {
      throw new EntityNotFoundError(
        `Could not delete document because it does not exist`,
      );
    }
    document.recordStatus = RecordStatus.Inactive;
  }
}
