import { Arrays, EntityNotFoundError } from '@core';
import { BasicCommandHandler } from '@module-cqrs';
import {
  DocumentRequestLinkEntity,
  DocumentRequestStatus,
  DocumentStatus,
} from '@module-persistence';
import {
  DocumentRequestLinkRepository,
  DocumentRequestRepository,
  LoadRepository,
} from '@module-persistence/repositories';
import { CommandHandler } from '@nestjs/cqrs';
import { DocumentMapper } from '../../../data';
import { UploadScannedDocumentCommand } from '../upload-scanned-document.comand';

@CommandHandler(UploadScannedDocumentCommand)
export class UploadScannedDocumentCommandHandler
  implements BasicCommandHandler<UploadScannedDocumentCommand>
{
  constructor(
    private readonly repository: LoadRepository,
    private readonly documentRequestRepository: DocumentRequestRepository,
    private readonly documentRequestLinkRepository: DocumentRequestLinkRepository,
    private readonly mapper: DocumentMapper,
  ) {}

  async execute({ request }: UploadScannedDocumentCommand): Promise<void> {
    const documentRequest = await this.documentRequestRepository.getOneById(
      request.requestId,
    );
    if (documentRequest.status !== DocumentRequestStatus.Sent) {
      throw new EntityNotFoundError(
        `Could not add document because document request status is not "sent"`,
      );
    }
    const load = await this.repository.getOneById(documentRequest.load.id);
    const documents = await Arrays.mapAsync(
      request.documentsRequest,
      async (item) => {
        return await this.mapper.uploadDocumentToEntity(item);
      },
    );
    const documentRequestLinks = await Arrays.mapAsync(
      documents,
      async (item) => {
        const documentRequestLink = new DocumentRequestLinkEntity();
        documentRequestLink.document = item;
        documentRequestLink.documentRequest = documentRequest;
        return documentRequestLink;
      },
    );

    load.documentStatus = DocumentStatus.DocReceived;
    load.isRead = false;
    load.documents.add(documents);
    this.documentRequestLinkRepository.persist(documentRequestLinks);
    documentRequest.status = DocumentRequestStatus.Received;
  }
}
