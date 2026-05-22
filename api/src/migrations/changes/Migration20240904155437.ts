import { Migration } from '@mikro-orm/migrations';

export class Migration20240904155437 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'alter table "peruse_jobs" drop constraint if exists "peruse_jobs_job_type_check";',
    );
    this.addSql(
      'alter table "peruse_jobs" drop constraint if exists "peruse_jobs_entity_type_check";',
    );

    this.addSql(
      'alter table "peruse_jobs" add constraint "peruse_jobs_job_type_check" check("job_type" in (\'classify\', \'classify_and_extract\', \'create_load\'));',
    );
    this.addSql(
      'alter table "peruse_jobs" add constraint "peruse_jobs_entity_type_check" check("entity_type" in (\'document\', \'attachment\', \'load\'));',
    );
  }

  async down(): Promise<void> {
    this.addSql(
      'alter table "peruse_jobs" drop constraint if exists "peruse_jobs_job_type_check";',
    );
    this.addSql(
      'alter table "peruse_jobs" drop constraint if exists "peruse_jobs_entity_type_check";',
    );

    this.addSql(
      'alter table "peruse_jobs" add constraint "peruse_jobs_job_type_check" check("job_type" in (\'classify\', \'classify_and_extract\'));',
    );
    this.addSql(
      'alter table "peruse_jobs" add constraint "peruse_jobs_entity_type_check" check("entity_type" in (\'document\', \'attachment\'));',
    );
  }
}
