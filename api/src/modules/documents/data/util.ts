import { DocumentType } from '@module-persistence';
import {
  PeruseClassificationResult,
  PeruseDocumentClassifications,
} from '@module-peruse';

export class DocumentDataUtil {
  static determineDocumentType(
    payload: PeruseClassificationResult,
  ): DocumentType {
    const peruseClassification = payload.getClassificationResult();
    switch (peruseClassification) {
      case PeruseDocumentClassifications.BOL:
        return DocumentType.BillOfLading;
      case PeruseDocumentClassifications.RateConfirmation:
        return DocumentType.RateConfirmation;
      case PeruseDocumentClassifications.Lumper:
        return DocumentType.LumperReceipt;
      case PeruseDocumentClassifications.Scales:
        return DocumentType.ScaleTicket;
      default:
        return undefined;
    }
  }
}
