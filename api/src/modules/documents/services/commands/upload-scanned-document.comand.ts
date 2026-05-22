import { RequestCommand } from '@module-cqrs';
import { UploadScannedDocumentRequest } from '../../data';

export class UploadScannedDocumentCommand extends RequestCommand<
  UploadScannedDocumentRequest,
  void
> {
  constructor(request: UploadScannedDocumentRequest) {
    super(request);
  }
}
