import {
  ActivityLogEntity,
  TagDefinitionEntity,
  TagDefinitionKey,
  TagDefinitionLevel,
  TagDefinitionVisibility,
  UsedByType,
} from '@module-persistence/entities';
import { v4 as uuidv4 } from 'uuid';

export const buildStubTagDefinitionEntity = (
  data?: Partial<TagDefinitionEntity>,
): TagDefinitionEntity => {
  const entity = new TagDefinitionEntity();
  entity.id = uuidv4();
  entity.key = TagDefinitionKey.MISSING_SIGNATURE;
  entity.name = 'Missing signature';
  entity.level = TagDefinitionLevel.Error;
  entity.usedBy = [UsedByType.User];
  entity.visibility = TagDefinitionVisibility.All;
  entity.createdAt = new Date();
  entity.updatedAt = new Date();
  Object.assign(entity, data);
  return entity;
};

export const buildActivityLogEntity = (
  data?: Partial<ActivityLogEntity>,
): ActivityLogEntity => {
  const entity = new ActivityLogEntity();
  entity.id = uuidv4();
  entity.createdAt = new Date();
  Object.assign(entity, data);
  return entity;
};
