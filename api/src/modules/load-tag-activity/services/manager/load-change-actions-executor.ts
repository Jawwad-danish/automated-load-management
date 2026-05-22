import { ChangeActions, ChangeOperation } from '@common';
import { LoadEntity } from '@module-persistence/entities';
import { Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { ChangeActionAssignOperationHandler } from './change-action-assign-operation-handler';
import { ChangeActionDeleteOperationHandler } from './change-action-delete-operation-handler';

@Injectable()
export class LoadChangeActionsExecutor {
  constructor(
    private assignOperationHandler: ChangeActionAssignOperationHandler,
    private deleteOperationHandler: ChangeActionDeleteOperationHandler,
  ) {}

  async apply(load: LoadEntity, changeActions: ChangeActions): Promise<void> {
    const groupId = uuidv4();
    for (const action of changeActions.actions) {
      if (action.properties.operation === ChangeOperation.Assign) {
        await this.assignOperationHandler.handle(action, load, groupId);
      }
      if (action.properties.operation === ChangeOperation.Delete) {
        await this.deleteOperationHandler.handle(action, load, groupId);
      }
    }
  }
}
