import { DataMapper } from '@core/mapping';
import { TagDefinitionEntity } from '@module-persistence/entities';
import { Injectable } from '@nestjs/common';
import { TagDefinition } from '../';

@Injectable()
export class TagDefinitionMapper
  implements DataMapper<TagDefinitionEntity, TagDefinition>
{
  async entityToModel(entity: TagDefinitionEntity): Promise<TagDefinition> {
    const tag = new TagDefinition({
      id: entity.id,
      name: entity.name,
      key: entity.key,
      level: entity.level,
      visibility: entity.visibility,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
      recordStatus: entity.recordStatus,
    });
    return tag;
  }
}
