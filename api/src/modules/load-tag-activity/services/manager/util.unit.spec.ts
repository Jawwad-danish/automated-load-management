import { mockMikroORMProvider, mockToken } from '@core/test';
import {
  ActivityLogEntity,
  LoadEntity,
  LoadTagEntity,
  TagDefinitionEntity,
  TagDefinitionKey,
} from '@module-persistence/entities';
import { buildStubLoadEntity } from '@module-persistence/test';
import { buildStubTagDefinitionEntity } from '@module-tag-definitions/test';
import { Test } from '@nestjs/testing';
import { loadContainsActiveTag } from './util';

describe('LoadTagActivity util', () => {
  const mockLoadWithTag = (tag: TagDefinitionEntity): LoadEntity => {
    const load = buildStubLoadEntity();
    const loadTag = new LoadTagEntity();
    const activity = new ActivityLogEntity();
    loadTag.tagDefinition = tag;
    activity.tagDefinition = tag;
    load.tags.add(loadTag);
    load.activities.add(activity);
    return load;
  };

  beforeEach(async () => {
    await Test.createTestingModule({
      providers: [mockMikroORMProvider],
    })
      .useMocker((token) => {
        return mockToken(token);
      })
      .compile();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('Checking for a tag in an load should be true if the load has that tag', () => {
    const tag = buildStubTagDefinitionEntity({
      key: TagDefinitionKey.MISSING_SIGNATURE,
    });
    const load = mockLoadWithTag(tag);
    const result = loadContainsActiveTag(load, tag);

    expect(result).toBe(true);
  });

  it('Checking for a tag in an load should be false if the load does not have the tag', () => {
    const load = mockLoadWithTag(
      buildStubTagDefinitionEntity({
        key: TagDefinitionKey.MISSING_SIGNATURE,
      }),
    );
    const result = loadContainsActiveTag(
      load,
      buildStubTagDefinitionEntity({
        key: TagDefinitionKey.MISSING_SIGNATURE,
      }),
    );

    expect(result).toBe(false);
  });
});
