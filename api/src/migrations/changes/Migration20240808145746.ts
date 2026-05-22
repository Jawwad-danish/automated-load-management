import { Migration } from '@mikro-orm/migrations';

export class Migration20240808145746 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'create table "tag_definitions" ("id" uuid not null default uuid_generate_v4(), "created_at" timestamptz(3) not null, "record_status" text check ("record_status" in (\'Active\', \'Inactive\')) not null default \'Active\', "updated_at" timestamptz(3) not null, "name" varchar(255) not null, "key" varchar(255) not null, "note" varchar(255) not null, "note_placeholders" text[] null, "level" text check ("level" in (\'info\', \'warning\', \'error\', \'other\')) not null, "used_by" text[] not null, "visibility" text check ("visibility" in (\'client\', \'employee\', \'all\')) not null, constraint "tag_definitions_pkey" primary key ("id"));',
    );
    this.addSql(
      'create index "tag_definitions_name_index" on "tag_definitions" ("name");',
    );
    this.addSql(
      'create index "tag_definitions_key_index" on "tag_definitions" ("key");',
    );
    this.addSql(
      'alter table "tag_definitions" add constraint "tag_definitions_key_unique" unique ("key");',
    );

    this.addSql(
      'create table "load_tag_assoc" ("id" uuid not null default uuid_generate_v4(), "created_at" timestamptz(3) not null, "record_status" text check ("record_status" in (\'Active\', \'Inactive\')) not null default \'Active\', "load_id" uuid not null, "tag_definition_id" uuid not null, "assigned_by_type" text check ("assigned_by_type" in (\'user\', \'system\')) not null, constraint "load_tag_assoc_pkey" primary key ("id"));',
    );
    this.addSql(
      'create index "load_tag_assoc_load_id_index" on "load_tag_assoc" ("load_id");',
    );
    this.addSql(
      'create index "load_tag_assoc_tag_definition_id_index" on "load_tag_assoc" ("tag_definition_id");',
    );

    this.addSql(
      'create table "load_activity_log" ("id" uuid not null default uuid_generate_v4(), "created_at" timestamptz(3) not null, "record_status" text check ("record_status" in (\'Active\', \'Inactive\')) not null default \'Active\', "tag_definition_id" uuid not null, "tag_status" text check ("tag_status" in (\'Active\', \'Inactive\')) not null default \'Active\', "group_id" uuid not null default uuid_generate_v4(), "note" text not null, "payload" jsonb not null, "load_id" uuid not null, constraint "load_activity_log_pkey" primary key ("id"));',
    );
    this.addSql(
      'create index "load_activity_log_tag_definition_id_index" on "load_activity_log" ("tag_definition_id");',
    );
    this.addSql(
      'create index "load_activity_log_load_id_index" on "load_activity_log" ("load_id");',
    );

    this.addSql(
      'create table "tag_definition_group" ("id" uuid not null default uuid_generate_v4(), "created_at" timestamptz(3) not null, "record_status" text check ("record_status" in (\'Active\', \'Inactive\')) not null default \'Active\', "updated_at" timestamptz(3) not null, "name" varchar(255) not null, "key" varchar(255) not null, constraint "tag_definition_group_pkey" primary key ("id"));',
    );
    this.addSql(
      'create index "tag_definition_group_key_index" on "tag_definition_group" ("key");',
    );
    this.addSql(
      'alter table "tag_definition_group" add constraint "tag_definition_group_key_unique" unique ("key");',
    );

    this.addSql(
      'create table "tag_group_assoc" ("id" uuid not null default uuid_generate_v4(), "created_at" timestamptz(3) not null, "record_status" text check ("record_status" in (\'Active\', \'Inactive\')) not null default \'Active\', "group_id" uuid not null, "tag_id" uuid not null, constraint "tag_group_assoc_pkey" primary key ("id"));',
    );

    this.addSql(
      'alter table "load_tag_assoc" add constraint "load_tag_assoc_load_id_foreign" foreign key ("load_id") references "loads" ("id") on update cascade;',
    );
    this.addSql(
      'alter table "load_tag_assoc" add constraint "load_tag_assoc_tag_definition_id_foreign" foreign key ("tag_definition_id") references "tag_definitions" ("id") on update cascade;',
    );

    this.addSql(
      'alter table "load_activity_log" add constraint "load_activity_log_tag_definition_id_foreign" foreign key ("tag_definition_id") references "tag_definitions" ("id") on update cascade;',
    );
    this.addSql(
      'alter table "load_activity_log" add constraint "load_activity_log_load_id_foreign" foreign key ("load_id") references "loads" ("id") on update cascade;',
    );

    this.addSql(
      'alter table "tag_group_assoc" add constraint "tag_group_assoc_group_id_foreign" foreign key ("group_id") references "tag_definition_group" ("id") on update cascade;',
    );
    this.addSql(
      'alter table "tag_group_assoc" add constraint "tag_group_assoc_tag_id_foreign" foreign key ("tag_id") references "tag_definitions" ("id") on update cascade;',
    );
  }

  async down(): Promise<void> {
    this.addSql(
      'alter table "load_tag_assoc" drop constraint "load_tag_assoc_tag_definition_id_foreign";',
    );

    this.addSql(
      'alter table "load_activity_log" drop constraint "load_activity_log_tag_definition_id_foreign";',
    );

    this.addSql(
      'alter table "tag_group_assoc" drop constraint "tag_group_assoc_tag_id_foreign";',
    );

    this.addSql(
      'alter table "tag_group_assoc" drop constraint "tag_group_assoc_group_id_foreign";',
    );

    this.addSql('drop table if exists "tag_definitions" cascade;');

    this.addSql('drop table if exists "load_tag_assoc" cascade;');

    this.addSql('drop table if exists "load_activity_log" cascade;');

    this.addSql('drop table if exists "tag_definition_group" cascade;');

    this.addSql('drop table if exists "tag_group_assoc" cascade;');
  }
}
