import {
  TagDefinitionKey,
  TagDefinitionLevel,
  TagDefinitionVisibility,
} from '@module-persistence/entities';
import { v4 as uuidv4 } from 'uuid';
import { TagDefinition } from '../data';

export const buildStubTagDefinition = (
  key: TagDefinitionKey = TagDefinitionKey.MISSING_SIGNATURE,
): TagDefinition => {
  return new TagDefinition({
    id: uuidv4(),
    key: key,
    name: 'Missing signature',
    level: TagDefinitionLevel.Error,
    visibility: TagDefinitionVisibility.All,
    createdAt: new Date(),
    updatedAt: new Date(),
  });
};
