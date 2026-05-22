import { ChangeActions } from '@common';
import { Note } from '@core/data';
import { mockMikroORMProvider, mockToken } from '@core/test';
import { TagDefinitionKey } from '@module-persistence/entities';
import { TagDefinitionRepository } from '@module-persistence/repositories';
import { Test, TestingModule } from '@nestjs/testing';
import { ChangeActionAssignOperationHandler } from './change-action-assign-operation-handler';
import {
  buildStubLoadEntity,
  buildStubLoadTagEntity,
} from '@module-persistence/test';
import { ValidationError } from '@core/errors';
import { buildStubTagDefinitionEntity } from '@module-tag-definitions/test';

describe('ChangeActionAssignOperationHandler', () => {
  let handler: ChangeActionAssignOperationHandler;
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
      providers: [mockMikroORMProvider, ChangeActionAssignOperationHandler],
    })
      .useMocker((token) => {
        return mockToken(token);
      })
      .compile();

    handler = module.get(ChangeActionAssignOperationHandler);
    tagRepository = module.get(TagDefinitionRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('Should be defined', () => {
    expect(handler).toBeDefined();
  });

  it('When change action is only tag, tag is assigned to load', async () => {
    const tagDefinitionStub = mockTagRepositoryGetByKey();
    const load = buildStubLoadEntity();

    await handler.handle(
      ChangeActions.addTag(tagDefinitionStub.key).actions[0],
      load,
      '',
    );

    expect(load.tags.length).toBe(1);
    expect(
      load.tags.find(
        (loadTag) =>
          loadTag.tagDefinition.id === tagDefinitionStub.id &&
          loadTag.tagDefinition.key === tagDefinitionStub.key,
      ),
    ).toBeDefined();

    expect(load.activities.length).toBe(0);
  });

  it('When change action is tag and activity, tag and activity are assigned to load', async () => {
    const tagDefinitionStub = mockTagRepositoryGetByKey();
    const load = buildStubLoadEntity();

    await handler.handle(
      ChangeActions.addTagAndActivity(
        tagDefinitionStub.key,
        Note.fromText('Note'),
      ).actions[0],
      load,
      '',
    );

    expect(load.tags.length).toBe(1);
    expect(
      load.tags.find(
        (loadTag) =>
          loadTag.tagDefinition.id === tagDefinitionStub.id &&
          loadTag.tagDefinition.key === tagDefinitionStub.key,
      ),
    ).toBeDefined();

    expect(load.activities.length).toBe(1);
    expect(
      load.activities.find(
        (activity) =>
          activity.tagDefinition.id === tagDefinitionStub.id &&
          activity.tagDefinition.key === tagDefinitionStub.key &&
          activity.note === 'Note',
      ),
    ).toBeDefined();
  });

  it('When change action is activity, activity is assigned to load', async () => {
    const tagDefinitionStub = mockTagRepositoryGetByKey(TagDefinitionKey.NOTE);
    const load = buildStubLoadEntity();

    await handler.handle(
      ChangeActions.addActivity(tagDefinitionStub.key, Note.fromText('Note'))
        .actions[0],
      load,
      '',
    );

    expect(load.activities.length).toBe(1);
    expect(
      load.activities.find(
        (activity) =>
          activity.tagDefinition.id === tagDefinitionStub.id &&
          activity.tagDefinition.key === tagDefinitionStub.key &&
          activity.note === 'Note',
      ),
    ).toBeDefined();
  });

  it('When change action is note tag and activity, only activity is assigned to load', async () => {
    const tagDefinitionStub = mockTagRepositoryGetByKey(TagDefinitionKey.NOTE);
    const load = buildStubLoadEntity();

    await handler.handle(
      ChangeActions.addTagAndActivity(
        tagDefinitionStub.key,
        Note.fromText('Note'),
      ).actions[0],
      load,
      '',
    );

    expect(load.tags.length).toBe(0);
    expect(load.activities.length).toBe(1);
    expect(
      load.activities.find(
        (activity) =>
          activity.tagDefinition.id === tagDefinitionStub.id &&
          activity.tagDefinition.key === tagDefinitionStub.key &&
          activity.note === 'Note',
      ),
    ).toBeDefined();
  });

  it('When change is tag, and load is already tagged, exception is thrown', async () => {
    const tagDefinitionStub = mockTagRepositoryGetByKey(
      TagDefinitionKey.MISSING_SIGNATURE,
    );

    const load = buildStubLoadEntity({
      tags: [buildStubLoadTagEntity(tagDefinitionStub)],
    });

    expect(
      handler.handle(
        ChangeActions.addTagAndActivity(
          tagDefinitionStub.key,
          Note.fromText('Note'),
        ).actions[0],
        load,
        '',
      ),
    ).rejects.toThrow(ValidationError);
  });
});
