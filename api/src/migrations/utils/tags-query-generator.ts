import { Query } from '@mikro-orm/migrations';
import { AbstractSqlDriver } from '@mikro-orm/postgresql';
import {
  TagDefinitionEntity,
  TagDefinitionGroupEntity,
  TagGroupAssocEntity,
} from '../../modules/persistence';
import { BaseQueryGenerator } from './base-query-generator';
import { v4 as uuidv4 } from 'uuid';

/**
 * Helper class used to manipulate tags in migrations.
 * This class only generates queries. These queries must
 * added to the migration for them to be executed
 */
export class TagsQueryGenerator extends BaseQueryGenerator {
  constructor(protected readonly driver: AbstractSqlDriver) {
    super(driver);
  }

  createTagGroup(data: Record<string, any>): Query {
    return this.getQuery(
      this.driver
        .createQueryBuilder(TagDefinitionGroupEntity.name)
        .insert(data)
        .onConflict('key')
        .ignore(),
    );
  }

  removeTagGroup(tagGroupKey: string): Query {
    return this.getQuery(
      this.driver
        .createQueryBuilder(TagDefinitionGroupEntity.name)
        .delete({ key: tagGroupKey }),
    );
  }

  addTag(data: Record<string, any>): Query {
    return this.getQuery(
      this.driver
        .createQueryBuilder(TagDefinitionEntity.name)
        .insert(data)
        .onConflict('key')
        .ignore(),
    );
  }

  addTags(data: Record<string, any>[]): Query {
    return this.getQuery(
      this.driver
        .createQueryBuilder(TagDefinitionEntity.name)
        .insert(data)
        .onConflict('key')
        .ignore(),
    );
  }

  removeTag(key: string): Query {
    return this.getQuery(
      this.driver
        .createQueryBuilder(TagDefinitionEntity.name)
        .delete({ key: key }),
    );
  }

  removeTags(keys: string[]): Query {
    return this.getQuery(
      this.driver
        .createQueryBuilder(TagDefinitionEntity.name)
        .delete({ key: { $in: keys } }),
    );
  }

  updateTag(oldTagKey: string, updateData: any): Query {
    return this.getQuery(
      this.driver
        .createQueryBuilder(TagDefinitionEntity.name)
        .update(updateData)
        .where({ key: oldTagKey }),
    );
  }

  removeTagGroups(keys: string[]): Query {
    return this.getQuery(
      this.driver
        .createQueryBuilder(TagDefinitionGroupEntity)
        .delete({ key: { $in: keys } }),
    );
  }

  addTagToExistingGroup(groupKey: string, tagKey: string): Query {
    const tagGroupQuery = this.driver
      .createQueryBuilder(TagDefinitionGroupEntity.name)
      .select('id')
      .where({ key: groupKey })
      .limit(1)
      .getKnexQuery();
    const tagDefinitionQuery = this.driver
      .createQueryBuilder(TagDefinitionEntity.name)
      .select('id')
      .where({ key: tagKey })
      .limit(1)
      .getKnexQuery();
    const entityData = this.buildAssociation(tagGroupQuery, tagDefinitionQuery);

    return this.getQuery(
      this.driver
        .createQueryBuilder(TagGroupAssocEntity.name)
        .insert(entityData),
    );
  }
  private buildAssociation(groupId: any, tagId: any) {
    return {
      id: uuidv4(),
      createdAt: new Date(),
      tag_id: tagId,
      group_id: groupId,
    };
  }

  removeTagFromExistingGroup(groupKey: string, tagKey: string): Query {
    const tagGroupQuery = this.driver
      .createQueryBuilder(TagDefinitionGroupEntity.name)
      .select('id')
      .where({ key: groupKey })
      .limit(1)
      .getKnexQuery();
    const tagDefinitionQuery = this.driver
      .createQueryBuilder(TagDefinitionEntity.name)
      .select('id')
      .where({ key: tagKey })
      .limit(1)
      .getKnexQuery();
    return this.getQuery(
      this.driver.createQueryBuilder(TagGroupAssocEntity.name).delete({
        tag_id: tagDefinitionQuery,
        group_id: tagGroupQuery,
      }),
    );
  }

  createTagGroupAssociation(data: Record<string, any>): Query {
    return this.getQuery(
      this.driver.createQueryBuilder(TagGroupAssocEntity.name).insert(data),
    );
  }

  removeTagGroupAssociationByGroupKeys(groupKeys: string[]): Query {
    return this.getQuery(
      this.driver
        .createQueryBuilder(TagGroupAssocEntity.name)
        .delete()
        .where({ group: { key: { $in: groupKeys } } }),
    );
  }
}
