import { DatabaseService, Transactional } from '@module-database';
import {
  DocumentRepository,
  InternalJobStatus,
  PeruseJobEntity,
  PeruseJobRepository,
} from '@module-persistence';
import {
  ClassificationJobsReadyEvent,
  PeruseClassificationResult,
} from '@module-peruse';
import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { DocumentDataUtil } from '../../data/util';
import { plainToInstance } from 'class-transformer';
import { errorSerializer } from '@common';

@Injectable()
export class UpdateDocumentEventHandler {
  private readonly logger: Logger = new Logger(UpdateDocumentEventHandler.name);

  constructor(
    private readonly databaseService: DatabaseService,
    private readonly jobRepository: PeruseJobRepository,
    private readonly documentRepository: DocumentRepository,
  ) {}

  @OnEvent('peruse.jobs.classification.ready', { async: true })
  async handleEvent(event: ClassificationJobsReadyEvent) {
    await this.databaseService.withRequestContext(async () => {
      try {
        await this.labelDocuments(event);
      } catch (error) {
        this.logger.error(
          'Could not handle event peruse.jobs.classification.ready',
          error,
        );
      }
    });
  }

  @Transactional('label-documents')
  async labelDocuments(event: ClassificationJobsReadyEvent) {
    const [jobs] = await this.jobRepository.findAll(
      {
        id: { $in: event.jobIds },
      },
      { populate: ['result'] },
    );

    this.logger.debug(`Labeling ${jobs.length} documents`);
    const promises = jobs.map((job) => this.updateDocumentType(job));
    return Promise.all(promises);
  }

  private async updateDocumentType(job: PeruseJobEntity): Promise<void> {
    try {
      const document = await this.documentRepository.getOneById(job.externalId);
      if (job.result) {
        const payload = plainToInstance(
          PeruseClassificationResult,
          job.result.payload,
        );
        const type = DocumentDataUtil.determineDocumentType(payload);
        document.type = type;
      }
      job.internalStatus = InternalJobStatus.Done;
    } catch (err) {
      this.logger.error(
        `Could not update document type for job id ${job.id} - ${err}`,
        err,
      );
      job.error = errorSerializer(err);
      job.internalStatus = InternalJobStatus.Error;
    }
  }
}
