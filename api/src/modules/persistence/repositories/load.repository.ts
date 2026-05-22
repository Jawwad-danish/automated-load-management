import { FilterOperator, QueryCriteria, SortingOrder } from '@core/data';
import { DatabaseService } from '@module-database';
import { Inject, Injectable } from '@nestjs/common';
import { LoadEntity, RecordStatus } from '../entities';
import { QueryCriteriaConfiguration } from './basic-repository/query-criteria.configuration';
import { QueryCriteriaRepository } from './basic-repository/query-criteria.repository';

@Injectable()
export class LoadRepository extends QueryCriteriaRepository<LoadEntity> {
  constructor(@Inject(DatabaseService) databaseService: DatabaseService) {
    super(databaseService, LoadEntity);
  }

  protected getQueryCriteriaConfiguration(): QueryCriteriaConfiguration<LoadEntity> {
    return {
      sortableColumns: {
        createdAt: new Set([SortingOrder.ASC, SortingOrder.DESC]),
        isRead: new Set([SortingOrder.ASC, SortingOrder.DESC]),
      },
      defaultSortableColumns: {
        isRead: SortingOrder.ASC,
        createdAt: SortingOrder.DESC,
      },
      searchableColumns: {
        brokerId: new Set([FilterOperator.EQ]),
        loadNumber: new Set([FilterOperator.EQ, FilterOperator.IN]),
        brokerName: new Set([FilterOperator.ILIKE]),
        factoredStatus: new Set([FilterOperator.EQ, FilterOperator.IN]),
        documentStatus: new Set([FilterOperator.EQ, FilterOperator.IN]),
      },
      pagination: {
        maxItemsPerPage: 100,
      },
    };
  }

  async getOneByClientAndId(id: string, clientId: string): Promise<LoadEntity> {
    return await this.repository.findOneOrFail(
      {
        id,
        clientId,
      },
      {
        populate: [
          'email',
          'addresses',
          'documents',
          'documentRequests',
          'documents.documentRequestLink',
        ],
      },
    );
  }

  async getOneById(id: string): Promise<LoadEntity> {
    return await this.repository.findOneOrFail(
      {
        id,
      },
      {
        populate: [
          'email',
          'addresses',
          'documents',
          'documentRequests',
          'documents.documentRequestLink',
        ],
      },
    );
  }

  async getAll(criteria: QueryCriteria, clientId: string) {
    return await this.findByQueryCriteria(criteria, {
      additionalWhereClause: {
        clientId,
        recordStatus: RecordStatus.Active,
      },
      populate: [
        'email',
        'addresses',
        'documents',
        'documentRequests',
        'documents.documentRequestLink',
      ],
    });
  }
}
