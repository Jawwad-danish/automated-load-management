import { Migration } from '@mikro-orm/migrations';
import { TagsQueryGenerator } from '../utils/tags-query-generator';

export class Migration20240808145906 extends Migration {
  async up(): Promise<void> {
    const tagsQueryGenerator = new TagsQueryGenerator(this.driver);

    // Group
    const groupQuery = tagsQueryGenerator.createTagGroup(tagGroup);
    this.addSql(groupQuery);

    // Tag definitions
    const query = tagsQueryGenerator.addTags(tags);
    this.addSql(query);

    // Associations
    for (const tag of tags) {
      const assocQuery = tagsQueryGenerator.addTagToExistingGroup(
        tagGroup.key,
        tag.key,
      );
      this.addSql(assocQuery);
    }
  }
  async down(): Promise<void> {
    const tagsQueryGenerator = new TagsQueryGenerator(this.driver);

    // Associations
    for (const tag of tags) {
      const assocQuery = tagsQueryGenerator.removeTagFromExistingGroup(
        tagGroup.key,
        tag.key,
      );
      this.addSql(assocQuery);
    }

    // Tag definitions
    const query = tagsQueryGenerator.removeTags(tags.map((tag) => tag.key));
    this.addSql(query);

    // Group
    const groupQuery = tagsQueryGenerator.removeTagGroup(tagGroup.key);
    this.addSql(groupQuery);
  }
}

const tagGroup = {
  name: 'Other',
  key: 'OTHER',
  createdAt: new Date(),
  updatedAt: new Date(),
};

const tags = [
  {
    name: 'Create Load',
    key: 'CREATE_LOAD',
    usedBy: ['system'],
    visibility: 'employee',
    level: 'info',
    note: 'Load created',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    name: 'Update Load',
    key: 'UPDATE_LOAD',
    usedBy: ['system'],
    visibility: 'employee',
    level: 'info',
    note: 'Load updated',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    name: 'Delete Load',
    key: 'DELETE_LOAD',
    usedBy: ['system'],
    visibility: 'employee',
    level: 'info',
    note: 'Load deleted',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    name: 'Other',
    key: 'OTHER',
    usedBy: ['system'],
    visibility: 'employee',
    level: 'info',
    note: 'Other',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    name: 'Note',
    key: 'NOTE',
    usedBy: ['system'],
    visibility: 'employee',
    level: 'info',
    note: 'Note',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    name: 'Missing Signature',
    key: 'MISSING_SIGNATURE',
    usedBy: ['system'],
    visibility: 'all',
    level: 'warning',
    note: 'Missing signature',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    name: 'Potential Double Brokering',
    key: 'POTENTIAL_DOUBLE_BROKERING',
    usedBy: ['system'],
    visibility: 'all',
    level: 'error',
    note: 'Potential double brokering',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    name: 'POD and Rate Con do not match',
    key: 'POD_AND_RATE_CON_NOT_MATCHING',
    usedBy: ['system'],
    visibility: 'all',
    level: 'error',
    note: 'POD and Rate Con do not match',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];
