import { Arrays } from '@core/util';
import { BasicCommandHandler } from '@module-cqrs';
import {
  DocumentEntity,
  DocumentStatus,
  JobEntityType,
} from '@module-persistence';
import { LoadRepository } from '@module-persistence/repositories';
import { PeruseService } from '@module-peruse';
import { CommandHandler } from '@nestjs/cqrs';
import { DocumentMapper } from '../../../data';
import { UploadDocumentCommand } from '../upload-document.command';
import { Filestack } from '@module-filestack';

@CommandHandler(UploadDocumentCommand)
export class UploadDocumentCommandHandler
  implements BasicCommandHandler<UploadDocumentCommand>
{
  constructor(
    private readonly repository: LoadRepository,
    private readonly mapper: DocumentMapper,
    private readonly filestackService: Filestack,
    private readonly peruseService: PeruseService,
  ) {}

  async execute({
    clientId,
    loadId,
    request,
  }: UploadDocumentCommand): Promise<DocumentEntity[]> {
    const load = await this.repository.getOneByClientAndId(loadId, clientId);

    const documentsToBeAdded = await Arrays.mapAsync(request, async (item) => {
      return await this.mapper.uploadDocumentToEntity(item);
    });
    const imageDocuments = documentsToBeAdded.filter((document) => {
      return document.name.toLowerCase().includes('png');
    });
    await this.convertImageDocumentsToPdf(imageDocuments);

    await this.sendDocumentsForClassification(documentsToBeAdded);

    load.documents.add(documentsToBeAdded);
    load.documentStatus = DocumentStatus.Uploaded;

    return documentsToBeAdded;
  }

  private async convertImageDocumentsToPdf(
    documents: DocumentEntity[],
  ): Promise<void> {
    for (const document of documents) {
      const conversionResult = await this.filestackService.convertImageToPdf(
        document.filestackUrl,
      );
      document.filestackUrl = conversionResult.url;
      document.s3Bucket = conversionResult.container;
      document.s3Key = conversionResult.key;
      document.name = conversionResult.filename;
    }
  }

  private async sendDocumentsForClassification(
    documents: DocumentEntity[],
  ): Promise<void> {
    const promises = documents.map((doc) => {
      return this.peruseService.classifyDocument({
        externalId: doc.id,
        s3Bucket: doc.s3Bucket,
        s3Key: doc.s3Key,
        type: JobEntityType.Document,
        extract: false,
      });
    });
    await Promise.all(promises);
  }
}
