import {
  Collection,
  Entity,
  Index,
  OneToMany,
  Property,
} from '@mikro-orm/core';
import { BasicMutableEntity } from './basic-mutable.entity';
import { TagGroupAssocEntity } from './tag-group-assoc.entity';

export enum TagDefinitionGroupKey {
  OTHER = 'OTHER',
}

@Entity({ tableName: 'tag_definition_group' })
export class TagDefinitionGroupEntity extends BasicMutableEntity {
  @Property({ type: 'text', nullable: false })
  name: string;

  @Index()
  @Property({ type: 'text', nullable: false, unique: true })
  key: string;

  @Index()
  @OneToMany(() => TagGroupAssocEntity, (tag) => tag.group, {
    orphanRemoval: true,
    eager: true,
  })
  tags = new Collection<TagGroupAssocEntity>(this);
}
