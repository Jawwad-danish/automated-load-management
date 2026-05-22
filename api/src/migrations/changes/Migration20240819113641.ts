import { Migration } from '@mikro-orm/migrations';

export class Migration20240819113641 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'create table "peruse_jobs" ("id" uuid not null default uuid_generate_v4(), "created_at" timestamptz(3) not null, "record_status" text check ("record_status" in (\'Active\', \'Inactive\')) not null default \'Active\', "job_type" text check ("job_type" in (\'classify\', \'classify_and_extract\')) not null, "entity_type" text check ("entity_type" in (\'document\', \'attachment\')) not null, "external_id" uuid not null, "internal_status" text check ("internal_status" in (\'done\', \'error\', \'pending\', \'ready\')) not null default \'pending\', "error" jsonb null, "result_id" uuid null, constraint "peruse_jobs_pkey" primary key ("id"));',
    );
    this.addSql(
      'comment on column "peruse_jobs"."job_type" is \'Internal type of the job\';',
    );
    this.addSql(
      'comment on column "peruse_jobs"."entity_type" is \'Type of entity that was submitted for the job\';',
    );
    this.addSql(
      'comment on column "peruse_jobs"."internal_status" is \'Internal status of the job\';',
    );
    this.addSql(
      'alter table "peruse_jobs" add constraint "peruse_jobs_result_id_unique" unique ("result_id");',
    );

    this.addSql(
      'alter table "peruse_jobs" add constraint "peruse_jobs_result_id_foreign" foreign key ("result_id") references "peruse_documents_results" ("id") on update cascade on delete set null;',
    );

    this.addSql(
      'alter table "peruse_documents_results" drop constraint "peruse_documents_results_document_id_foreign";',
    );

    this.addSql('drop index "peruse_documents_results_document_id_index";');

    this.addSql(
      'comment on column "peruse_documents_results"."status" is \'Peruse job status\';',
    );
    this.addSql(
      'alter table "peruse_documents_results" rename column "document_id" to "job_id";',
    );
    this.addSql(
      'alter table "peruse_documents_results" add constraint "peruse_documents_results_job_id_foreign" foreign key ("job_id") references "peruse_jobs" ("id") on update cascade;',
    );
    this.addSql(
      'create index "peruse_documents_results_job_id_index" on "peruse_documents_results" ("job_id");',
    );
    this.addSql(
      'alter table "peruse_documents_results" add constraint "peruse_documents_results_job_id_unique" unique ("job_id");',
    );
  }

  async down(): Promise<void> {
    this.addSql(
      'alter table "peruse_documents_results" drop constraint "peruse_documents_results_job_id_foreign";',
    );

    this.addSql('drop table if exists "peruse_jobs" cascade;');

    this.addSql('drop index "peruse_documents_results_job_id_index";');
    this.addSql(
      'alter table "peruse_documents_results" drop constraint "peruse_documents_results_job_id_unique";',
    );

    this.addSql(
      'comment on column "peruse_documents_results"."status" is null;',
    );
    this.addSql(
      'alter table "peruse_documents_results" rename column "job_id" to "document_id";',
    );
    this.addSql(
      'alter table "peruse_documents_results" add constraint "peruse_documents_results_document_id_foreign" foreign key ("document_id") references "documents" ("id") on update cascade on delete no action;',
    );
    this.addSql(
      'create index "peruse_documents_results_document_id_index" on "peruse_documents_results" ("document_id");',
    );
  }
}
