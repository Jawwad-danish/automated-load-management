import { RequestCommand } from '@module-cqrs';
import { DocumentEntity } from '@module-persistence/entities';
import { UploadDocumentRequest } from '../../data';

export class UploadDocumentCommand extends RequestCommand<
  UploadDocumentRequest[],
  DocumentEntity[]
> {
  constructor(
    readonly clientId: string,
    readonly loadId: string,
    request: UploadDocumentRequest[],
  ) {
    super(request);
  }
}
