import {
  AppContextHolder,
  Arrays,
  EntityNotFoundError,
  ValidationError,
} from '@core';
import { PageResult, PaginationResult, QueryCriteria } from '@core/data';
import { CommandRunner } from '@module-cqrs';
import { Transactional } from '@module-database';
import {
  DocumentRequestRepository,
  DocumentRequestStatus,
  DocumentStatus,
  FactoredStatus,
  LoadEntity,
  LoadRepository,
  RecordStatus,
} from '@module-persistence';
import { Injectable } from '@nestjs/common';
import { FactorLoadRequest, UpdateLoadRequest } from '../data';
import { LoadMapper } from '../data/mappers';
import { LoadsStats } from '../data/models';
import { UpdateLoadCommand } from './commands/update-load.command';
import { SegmentEvents, SegmentService } from '@module-segment';

@Injectable()
export class LoadsService {
  constructor(
    private readonly loadRepository: LoadRepository,
    private readonly documentRequestRepository: DocumentRequestRepository,
    private readonly loadMapper: LoadMapper,
    private readonly commandRunner: CommandRunner,
    private readonly analytics: SegmentService,
  ) {}

  async findAll(clientId: string, criteria: QueryCriteria) {
    const [entities, count] = await this.loadRepository.getAll(
      criteria,
      clientId,
    );

    const loads = await Arrays.mapAsync(entities, (e) =>
      this.loadMapper.entityToModel(e),
    );

    return new PageResult(
      loads,
      new PaginationResult(criteria.page.page, criteria.page.limit, count),
    );
  }

  async getDriverLoad(requestId: string): Promise<LoadEntity> {
    const documentRequest =
      await this.documentRequestRepository.getOneById(requestId);

    if (documentRequest.status !== DocumentRequestStatus.Sent) {
      throw new EntityNotFoundError(
        `Could not add document because document request status is not "sent"`,
      );
    }
    return await this.loadRepository.getOneById(documentRequest.load.id);
  }

  async loadsStats(clientId: string) {
    const factoredLoadsCount = await this.loadRepository.count({
      clientId,
      factoredStatus: FactoredStatus.Factored,
      recordStatus: RecordStatus.Active,
    });

    const docReceivedLoadsCount = await this.loadRepository.count({
      clientId,
      $or: [
        {
          documentStatus: DocumentStatus.DocReceived,
        },
        {
          documentStatus: DocumentStatus.Uploaded,
        },
      ],
      factoredStatus: FactoredStatus.None,
      recordStatus: RecordStatus.Active,
    });

    const docRequestedLoadsCount = await this.loadRepository.count({
      clientId,
      documentStatus: DocumentStatus.DocRequested,
      factoredStatus: FactoredStatus.None,
      recordStatus: RecordStatus.Active,
    });

    const noDocsLoadsCount = await this.loadRepository.count({
      clientId,
      documentStatus: DocumentStatus.None,
      factoredStatus: FactoredStatus.None,
      recordStatus: RecordStatus.Active,
    });

    return new LoadsStats({
      factoredLoadsCount,
      docReceivedLoadsCount,
      docRequestedLoadsCount,
      noDocsLoadsCount,
    });
  }

  @Transactional('update-load')
  async update(clientId: string, loadId: string, request: UpdateLoadRequest) {
    const load = await this.commandRunner.run(
      new UpdateLoadCommand(loadId, clientId, request),
    );
    if (request.isRead === true) {
      return load;
    }
    this.analytics.track(load.email.fromEmail, SegmentEvents.LoadEdited, {
      loadNumber: load.loadNumber,
      brokerName: load.brokerName,
      brokerEmail: load.brokerEmail,
      updatedFields: Object.keys(request).filter(
        (key) => request[key] !== undefined,
      ),
      date: Date.now(),
      appType: AppContextHolder.get().consumer,
    });
    return load;
  }

  @Transactional('delete-load')
  async delete(clientId: string, loadId: string) {
    const load = await this.loadRepository.getOneByClientAndId(
      loadId,
      clientId,
    );
    if (load.factoredStatus === FactoredStatus.Factored) {
      throw new ValidationError('Cannot delete factored load.');
    }
    load.recordStatus = RecordStatus.Inactive;
    this.analytics.track(load.email.fromEmail, SegmentEvents.LoadDeleted, {
      loadNumber: load.loadNumber,
      brokerName: load.brokerName,
      brokerEmail: load.brokerEmail,
      date: Date.now(),
      appType: AppContextHolder.get().consumer,
    });
  }

  @Transactional('factor')
  async factor(clientId: string, loadId: string, request: FactorLoadRequest) {
    const load = await this.loadRepository.getOneByClientAndId(
      loadId,
      clientId,
    );
    load.factoredStatus = FactoredStatus.Factored;
    load.invoiceId = request.invoiceId;
    this.analytics.track(load.email.fromEmail, SegmentEvents.LoadFactored, {
      loadId: load.id,
      loadNumber: load.loadNumber,
      brokerName: load.brokerName,
      invoiceId: load.invoiceId,
      totalAmount: load.totalAmount,
      appType: AppContextHolder.get().consumer,
    });
  }

  async getOneById(clientId: string, loadId: string) {
    const load = await this.loadRepository.getOneByClientAndId(
      loadId,
      clientId,
    );
    return await this.loadMapper.entityToModel(load);
  }
}
