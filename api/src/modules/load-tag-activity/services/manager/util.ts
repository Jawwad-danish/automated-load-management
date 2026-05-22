import {
  LoadEntity,
  LoadTagEntity,
  RecordStatus,
  TagDefinitionEntity,
} from '@module-persistence/entities';

export const loadContainsActiveTag = (
  load: LoadEntity,
  tag: TagDefinitionEntity,
): boolean => {
  const foundTag = findActiveLoadTag(load, tag);
  return !!foundTag;
};

export const findActiveLoadTag = (
  load: LoadEntity,
  tag: TagDefinitionEntity,
): undefined | LoadTagEntity => {
  return load.tags.find((loadTag) => {
    return (
      loadTag.recordStatus === RecordStatus.Active &&
      loadTag.tagDefinition.id === tag.id
    );
  });
};
