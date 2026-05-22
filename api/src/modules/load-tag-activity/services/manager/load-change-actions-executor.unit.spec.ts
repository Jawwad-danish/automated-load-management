import { ChangeActions } from '@common';
import { mockMikroORMProvider, mockToken } from '@core/test';
import { TagDefinitionKey } from '@module-persistence/entities';
import { Test, TestingModule } from '@nestjs/testing';
import { ChangeActionAssignOperationHandler } from './change-action-assign-operation-handler';
import { ChangeActionDeleteOperationHandler } from './change-action-delete-operation-handler';
import { LoadChangeActionsExecutor } from './load-change-actions-executor';
import { buildStubLoadEntity } from '@module-persistence/test';

describe('LoadChangeActionsExecutor', () => {
  let manager: LoadChangeActionsExecutor;
  let assignOperationHandler: ChangeActionAssignOperationHandler;
  let deleteOperationHandler: ChangeActionDeleteOperationHandler;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [mockMikroORMProvider, LoadChangeActionsExecutor],
    })
      .useMocker((token) => {
        return mockToken(token);
      })
      .compile();

    manager = module.get(LoadChangeActionsExecutor);
    assignOperationHandler = module.get(ChangeActionAssignOperationHandler);
    deleteOperationHandler = module.get(ChangeActionDeleteOperationHandler);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('Should be defined', () => {
    expect(manager).toBeDefined();
  });

  it('When change operation is assign, assign handler is called', async () => {
    expect(manager).toBeDefined();

    await manager.apply(
      buildStubLoadEntity(),
      ChangeActions.addTag(TagDefinitionKey.MISSING_SIGNATURE),
    );

    expect(jest.spyOn(assignOperationHandler, 'handle')).toHaveBeenCalledTimes(
      1,
    );
  });

  it('When change operation is delete, delete handler is called', async () => {
    expect(manager).toBeDefined();

    await manager.apply(
      buildStubLoadEntity(),
      ChangeActions.deleteTag(TagDefinitionKey.MISSING_SIGNATURE),
    );

    expect(jest.spyOn(deleteOperationHandler, 'handle')).toHaveBeenCalledTimes(
      1,
    );
  });
});
