import { DatabaseService } from '@module-database';
import { Inject, Injectable } from '@nestjs/common';
import { DriverEntity, RecordStatus } from '../entities';
import { QueryCriteriaRepository } from './basic-repository/query-criteria.repository';
import { QueryCriteriaConfiguration } from './basic-repository/query-criteria.configuration';
import { FilterOperator, SortingOrder } from '@core/data';

@Injectable()
export class DriverRepository extends QueryCriteriaRepository<DriverEntity> {
  protected getQueryCriteriaConfiguration(): QueryCriteriaConfiguration<DriverEntity> {
    return {
      sortableColumns: {
        createdAt: new Set([SortingOrder.ASC, SortingOrder.DESC]),
      },
      defaultSortableColumns: {
        createdAt: SortingOrder.DESC,
      },
      searchableColumns: {
        id: new Set([FilterOperator.EQ]),
        name: new Set([FilterOperator.EQ, FilterOperator.ILIKE]),
      },
      pagination: {
        maxItemsPerPage: 100,
      },
    };
  }
  constructor(@Inject(DatabaseService) databaseService: DatabaseService) {
    super(databaseService, DriverEntity);
  }

  async getOneById(id: string): Promise<DriverEntity> {
    return await this.repository.findOneOrFail({
      id,
      recordStatus: RecordStatus.Active,
    });
  }
}
