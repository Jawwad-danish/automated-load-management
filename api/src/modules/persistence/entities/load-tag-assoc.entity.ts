import {
  Entity,
  Enum,
  Index,
  LoadStrategy,
  ManyToOne,
  Rel,
} from '@mikro-orm/core';
import { BasicEntity } from './basic.entity';
import { TagDefinitionEntity, UsedByType } from './tag-definition.entity';
import { LoadEntity } from './load.entity';

@Entity({ tableName: 'load_tag_assoc' })
export class LoadTagEntity extends BasicEntity {
  @Index()
  @ManyToOne({ entity: () => LoadEntity })
  load: Rel<LoadEntity>;

  @Index()
  @ManyToOne({
    entity: () => TagDefinitionEntity,
    strategy: LoadStrategy.JOINED,
    eager: true,
  })
  tagDefinition: TagDefinitionEntity;

  @Enum({
    items: () => UsedByType,
    nullable: false,
  })
  assignedByType: UsedByType;
}
