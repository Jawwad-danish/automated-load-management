import { Migration } from '@mikro-orm/migrations';

export class Migration20240909135737 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'alter table "loads" add column "is_read" boolean not null default false;',
    );
    this.addSql('update "loads" set "is_read" = true;');
  }

  async down(): Promise<void> {
    this.addSql('alter table "loads" drop column "is_read";');
  }
}
