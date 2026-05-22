import { ChangeActions } from '@common';
import { mockMikroORMProvider, mockToken } from '@core/test';

import {
  RecordStatus,
  TagDefinitionKey,
  TagStatus,
} from '@module-persistence/entities';
import { TagDefinitionRepository } from '@module-persistence/repositories';
import { buildStubTagDefinitionEntity } from '@module-tag-definitions/test';
import { Test, TestingModule } from '@nestjs/testing';
import { ChangeActionDeleteOperationHandler } from './change-action-delete-operation-handler';
import { v4 as uuidv4 } from 'uuid';
import {
  buildStubActivityEntity,
  buildStubLoadEntity,
  buildStubLoadTagEntity,
} from '../../../persistence/test';
import { ValidationError } from '../../../../core/errors';

describe('ChangeActionDeleteOperationHandler', () => {
  let handler: ChangeActionDeleteOperationHandler;
  let tagRepository: TagDefinitionRepository;

  const mockTagRepositoryGetByKey = (
    key: TagDefinitionKey = TagDefinitionKey.MISSING_SIGNATURE,
  ) => {
    const entity = buildStubTagDefinitionEntity({
      key,
    });
    jest.spyOn(tagRepository, 'getByKey').mockResolvedValue(entity);
    return entity;
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [mockMikroORMProvider, ChangeActionDeleteOperationHandler],
    })
      .useMocker((token) => {
        return mockToken(token);
      })
      .compile();

    handler = module.get(ChangeActionDeleteOperationHandler);
    tagRepository = module.get(TagDefinitionRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('Should be defined', () => {
    expect(handler).toBeDefined();
  });

  it('When change action is delete tag, tag is deleted from load', async () => {
    const tagDefinitionStub = mockTagRepositoryGetByKey(
      TagDefinitionKey.MISSING_SIGNATURE,
    );
    const load = buildStubLoadEntity({
      tags: [buildStubLoadTagEntity(tagDefinitionStub)],
    });

    await handler.handle(
      ChangeActions.deleteTag(tagDefinitionStub.key).actions[0],
      load,
      '',
    );

    expect(load.tags.length).toBe(1);
    expect(
      load.tags.find(
        (loadTag) =>
          loadTag.tagDefinition.id === tagDefinitionStub.id &&
          loadTag.tagDefinition.key === tagDefinitionStub.key &&
          loadTag.recordStatus === RecordStatus.Inactive,
      ),
    ).toBeDefined();

    expect(load.activities.length).toBe(1);
    expect(
      load.activities.find(
        (activity) =>
          activity.tagDefinition.id === tagDefinitionStub.id &&
          activity.tagDefinition.key === tagDefinitionStub.key &&
          activity.tagStatus === TagStatus.Inactive,
      ),
    ).toBeDefined();
  });

  it('When change action is delete tag, and tag is not on load, exception is thrown', async () => {
    const tagDefinitionStub = mockTagRepositoryGetByKey(
      TagDefinitionKey.MISSING_SIGNATURE,
    );
    const load = buildStubLoadEntity({
      tags: [
        buildStubLoadTagEntity(
          buildStubTagDefinitionEntity({
            key: TagDefinitionKey.MISSING_SIGNATURE,
          }),
        ),
      ],
    });

    expect(
      handler.handle(
        ChangeActions.deleteTag(tagDefinitionStub.key).actions[0],
        load,
        '',
      ),
    ).rejects.toThrow(ValidationError);
  });

  it('When change action is delete tag, and tag is not on load, exception is not thrown if optional', async () => {
    const tagDefinitionStub = mockTagRepositoryGetByKey(
      TagDefinitionKey.MISSING_SIGNATURE,
    );
    const load = buildStubLoadEntity({
      tags: [
        buildStubLoadTagEntity(
          buildStubTagDefinitionEntity({
            key: TagDefinitionKey.MISSING_SIGNATURE,
          }),
        ),
      ],
    });

    expect(
      handler.handle(
        ChangeActions.deleteTag(tagDefinitionStub.key, { optional: true })
          .actions[0],
        load,
        '',
      ),
    ).resolves.not.toThrow();
  });

  it('When change action is delete activity, tag and activity are deleted from load', async () => {
    const tagDefinitionStub = mockTagRepositoryGetByKey(
      TagDefinitionKey.MISSING_SIGNATURE,
    );
    const activityEntityStub = buildStubActivityEntity(tagDefinitionStub);
    const load = buildStubLoadEntity({
      tags: [buildStubLoadTagEntity(tagDefinitionStub)],
      activities: [activityEntityStub],
    });

    await handler.handle(
      ChangeActions.deleteTagActivity(activityEntityStub.id).actions[0],
      load,
      '',
    );

    expect(load.activities.length).toBe(2);
    // Initial activity is not deleted
    expect(
      load.activities.find(
        (activity) =>
          activity.tagDefinition.id === tagDefinitionStub.id &&
          activity.tagDefinition.key === tagDefinitionStub.key &&
          activity.tagStatus === TagStatus.Active &&
          activity.recordStatus === RecordStatus.Inactive,
      ),
    ).toBeDefined();

    // New activity to reflect the tag deletion
    expect(
      load.activities.find(
        (activity) =>
          activity.tagDefinition.id === tagDefinitionStub.id &&
          activity.tagDefinition.key === tagDefinitionStub.key &&
          activity.tagStatus === TagStatus.Inactive &&
          activity.recordStatus === RecordStatus.Active,
      ),
    ).toBeDefined();
    expect(
      load.tags.find(
        (loadTag) =>
          loadTag.tagDefinition.id === tagDefinitionStub.id &&
          loadTag.tagDefinition.key === tagDefinitionStub.key &&
          loadTag.recordStatus === RecordStatus.Inactive,
      ),
    ).toBeDefined();
  });

  it('When change action is delete activity, and activity is not on load, exception is thrown', async () => {
    const tagDefinitionStub = mockTagRepositoryGetByKey(
      TagDefinitionKey.MISSING_SIGNATURE,
    );
    const load = buildStubLoadEntity({
      activities: [buildStubActivityEntity(tagDefinitionStub)],
    });

    expect(
      handler.handle(
        ChangeActions.deleteTagActivity(uuidv4()).actions[0],
        load,
        '',
      ),
    ).rejects.toThrow(ValidationError);
  });

  it('When change action is delete activity, and activity is not on load, but operation is optional, exception is not thrown', async () => {
    const tagDefinitionStub = mockTagRepositoryGetByKey(
      TagDefinitionKey.MISSING_SIGNATURE,
    );
    const load = buildStubLoadEntity({
      activities: [buildStubActivityEntity(tagDefinitionStub)],
    });

    expect(
      handler.handle(
        ChangeActions.deleteTagActivity(uuidv4(), { optional: true })
          .actions[0],
        load,
        '',
      ),
    ).resolves.not.toThrowError();
  });

  it('When change action is delete activity, and activity is already deleted, exception is thrown', async () => {
    const tagDefinitionStub = mockTagRepositoryGetByKey(
      TagDefinitionKey.MISSING_SIGNATURE,
    );
    const activity = buildStubActivityEntity(tagDefinitionStub);
    activity.recordStatus = RecordStatus.Inactive;
    const load = buildStubLoadEntity({
      activities: [activity],
    });

    expect(
      handler.handle(
        ChangeActions.deleteTagActivity(activity.id).actions[0],
        load,
        '',
      ),
    ).rejects.toThrow(ValidationError);
  });
});
