import { DatabaseService } from '@module-database';
import { ActivityLogEntity } from '@module-persistence/entities';
import { BasicRepository } from '@module-persistence/repositories';
import { Inject, Injectable } from '@nestjs/common';

@Injectable()
export class ActivityLogRepository extends BasicRepository<ActivityLogEntity> {
  constructor(@Inject(DatabaseService) databaseService: DatabaseService) {
    super(databaseService, ActivityLogEntity);
  }
}
