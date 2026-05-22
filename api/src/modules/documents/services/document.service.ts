import { Arrays, CrossCuttingConcerns } from '@core/util';
import { CommandRunner } from '@module-cqrs';
import { Transactional } from '@module-database';
import { Injectable } from '@nestjs/common';

import { UploadDocumentRequest, UploadScannedDocumentRequest } from '../data';
import {
  DeleteDocumentCommand,
  UploadDocumentCommand,
  UploadScannedDocumentCommand,
} from './commands';
import { DocumentEntity } from '@module-persistence';
import { SegmentEvents, SegmentService } from '@module-segment';
import { AppContextHolder } from '@core';

@Injectable()
export class DocumentService {
  constructor(
    private readonly commandRunner: CommandRunner,
    private readonly analytics: SegmentService,
  ) {}

  @CrossCuttingConcerns<DocumentService, 'delete'>({
    logging: (clientId: string, loadId: string, documentId: string) => {
      return {
        message: 'Delete document from load',
        payload: {
          clientId,
          loadId,
          documentId,
        },
      };
    },
  })
  @Transactional('delete-document')
  async delete(clientId: string, loadId: string, documentId: string) {
    await this.commandRunner.run(
      new DeleteDocumentCommand(clientId, loadId, documentId),
    );
  }

  @CrossCuttingConcerns<DocumentService, 'upload'>({
    logging: (
      clientId: string,
      loadId: string,
      request: UploadDocumentRequest[],
    ) => {
      return {
        message: 'Upload document to load',
        payload: {
          clientId,
          loadId,
          documents: request,
        },
      };
    },
  })
  @Transactional('upload-document')
  async upload(
    clientId: string,
    loadId: string,
    request: UploadDocumentRequest[],
  ) {
    const documentEntities: DocumentEntity[] = await this.commandRunner.run(
      new UploadDocumentCommand(clientId, loadId, request),
    );
    if (documentEntities) {
      const uploadedDocuments = await Arrays.mapAsync(
        documentEntities,
        async (documentEntity) => {
          return {
            id: documentEntity.id,
            name: documentEntity.name,
            loadId: documentEntity.load.id,
            label: documentEntity.label,
            type: documentEntity.type,
          };
        },
      );
      this.analytics.track(
        documentEntities[0].load.email.fromEmail,
        SegmentEvents.DocumentUploaded,
        {
          loadId: documentEntities[0].load.id,
          uploadedDocuments: uploadedDocuments,
          appType: AppContextHolder.get().consumer,
        },
      );
    }
    return documentEntities;
  }

  @CrossCuttingConcerns<DocumentService, 'uploadScannedDocument'>({
    logging: (request: UploadScannedDocumentRequest) => {
      return {
        message: 'Upload scanned document',
        payload: {
          documents: request,
        },
      };
    },
  })
  @Transactional('upload-scanned-document')
  async uploadScannedDocument(request: UploadScannedDocumentRequest) {
    await this.commandRunner.run(new UploadScannedDocumentCommand(request));
  }
}
