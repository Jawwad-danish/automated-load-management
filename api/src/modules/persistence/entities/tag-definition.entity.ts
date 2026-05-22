import {
  Collection,
  Entity,
  Enum,
  Index,
  OneToMany,
  Property,
  types,
} from '@mikro-orm/core';
import { BasicMutableEntity } from './basic-mutable.entity';
import { TagGroupAssocEntity } from './tag-group-assoc.entity';

export enum TagDefinitionKey {
  CREATE_LOAD = 'CREATE_LOAD',
  UPDATE_LOAD = 'UPDATE_LOAD',
  DELETE_LOAD = 'DELETE_LOAD',
  OTHER = 'OTHER',
  NOTE = 'NOTE',
  MISSING_SIGNATURE = 'MISSING_SIGNATURE',
  POTENTIAL_DOUBLE_BROKERING = 'POTENTIAL_DOUBLE_BROKERING',
  POD_AND_RATE_CON_NOT_MATCHING = 'POD_AND_RATE_CON_NOT_MATCHING',
}

export enum UsedByType {
  User = 'user',
  System = 'system',
}

export enum TagDefinitionLevel {
  Info = 'info',
  Warning = 'warning',
  Error = 'error',
  Other = 'other',
}

export enum TagDefinitionVisibility {
  Client = 'client',
  Employee = 'employee',
  All = 'all',
}

@Entity({ tableName: 'tag_definitions' })
export class TagDefinitionEntity extends BasicMutableEntity {
  @Index()
  @Property({ type: 'text', nullable: false, unique: false })
  name: string;

  @Index()
  @Property({ type: 'text', nullable: false, unique: true })
  key: TagDefinitionKey;

  @Property({ type: 'text', nullable: false })
  note: string;

  @Property({ type: types.array, nullable: true })
  notePlaceholders?: string[];

  @Enum({
    items: () => TagDefinitionLevel,
    nullable: false,
  })
  level: TagDefinitionLevel;

  @Enum({
    items: () => UsedByType,
    array: true,
    nullable: false,
  })
  usedBy: UsedByType[];

  @Enum({
    items: () => TagDefinitionVisibility,
    nullable: false,
  })
  visibility: TagDefinitionVisibility;

  @Index()
  @OneToMany(() => TagGroupAssocEntity, (tag) => tag.tag, {
    orphanRemoval: true,
  })
  group: Collection<TagGroupAssocEntity>;
}
