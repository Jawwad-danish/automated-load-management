import { AuthModule } from '@module-auth';
import { PersistenceModule } from '@module-persistence';
import { Module } from '@nestjs/common';
import {
  ChangeActionAssignOperationHandler,
  ChangeActionDeleteOperationHandler,
  LoadChangeActionsExecutor,
} from './services';

@Module({
  imports: [AuthModule, PersistenceModule],
  controllers: [],
  providers: [
    ChangeActionAssignOperationHandler,
    ChangeActionDeleteOperationHandler,
    LoadChangeActionsExecutor,
  ],
  exports: [LoadChangeActionsExecutor],
})
export class LoadsTagActivityModule {}
