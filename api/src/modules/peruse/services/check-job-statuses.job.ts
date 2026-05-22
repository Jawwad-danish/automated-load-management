import { DatabaseService, Transactional } from '@module-database';
import {
  InternalJobStatus,
  InternalJobType,
  PeruseJobEntity,
  PeruseJobRepository,
  PeruseJobStatus,
} from '@module-persistence';
import {
  ClassificationJobsReadyEvent,
  PeruseJobMapper,
  PeruseClassificationResult,
  CreateLoadJobsReadyEvent,
} from '@module-peruse';
import { Injectable, Logger } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PeruseService } from './peruse.service';
import { errorSerializer } from '@common/exceptions';

@Injectable()
export class CheckJobStatusesJob {
  private readonly logger: Logger = new Logger(CheckJobStatusesJob.name);

  constructor(
    private readonly databaseService: DatabaseService,
    private readonly peruseService: PeruseService,
    private readonly jobRepository: PeruseJobRepository,
    private readonly mapper: PeruseJobMapper,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  @Cron(CronExpression.EVERY_5_SECONDS)
  async handleCron() {
    await this.databaseService.withRequestContext(async () => {
      try {
        await this.checkJobStatuses();
      } catch (error) {
        this.logger.error(
          `Could not run cron for checking job statuses ${error}`,
          error,
        );
      }
    });
  }

  async checkJobStatuses() {
    const [jobs] = await this.jobRepository.findAll({
      internalStatus: InternalJobStatus.Pending,
    });

    if (jobs.length) {
      this.logger.debug(`Processing ${jobs.length} pending Peruse jobs`);
      await this.processJobs(jobs);
      const readyJobs = jobs.filter(
        (job) => job.internalStatus === InternalJobStatus.Ready,
      );
      const classificationJobs = readyJobs
        .filter((job) => job.jobType === InternalJobType.Classify)
        .map((job) => job.id);

      if (classificationJobs.length) {
        this.eventEmitter.emit(
          'peruse.jobs.classification.ready',
          new ClassificationJobsReadyEvent({
            jobIds: classificationJobs,
          }),
        );
      }

      const createLoadJobs = readyJobs
        .filter((job) => job.jobType === InternalJobType.CreateLoad)
        .map((job) => job.id);
      if (createLoadJobs.length) {
        this.eventEmitter.emit(
          'peruse.jobs.create-load.ready',
          new CreateLoadJobsReadyEvent({
            jobIds: createLoadJobs,
          }),
        );
      }
    }
  }

  @Transactional('process-peruse-jobs')
  private async processJobs(jobs: PeruseJobEntity[]): Promise<void> {
    const promises = [];
    for (const job of jobs) {
      const result = await this.peruseService.getJob(job.id);
      if (result.status === PeruseJobStatus.Pending) {
        continue;
      }
      promises.push(this.storeJobResult(result, job));
    }
    await Promise.all(promises);
  }

  private async storeJobResult(
    result: PeruseClassificationResult,
    job: PeruseJobEntity,
  ): Promise<void> {
    try {
      const resultEntity = this.mapper.resultToResultEntity(result);
      resultEntity.job = job;
      job.result = resultEntity;
      job.internalStatus = this.determineInternalJobStatus(result);
      this.jobRepository.persist(job);
    } catch (err) {
      this.logger.error(
        `Could not store result for job id ${result.getJobId()}`,
        err,
      );
      job.error = errorSerializer(err);
      job.internalStatus = InternalJobStatus.Error;
    }
  }

  private determineInternalJobStatus(
    result: PeruseClassificationResult,
  ): InternalJobStatus {
    switch (result.status) {
      case PeruseJobStatus.Error:
        return InternalJobStatus.Error;
      case PeruseJobStatus.Success:
        return InternalJobStatus.Ready;
      case PeruseJobStatus.Pending:
      default:
        return InternalJobStatus.Pending;
    }
  }
}
