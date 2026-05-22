import { Migration } from '@mikro-orm/migrations';

export class Migration20240812174603 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'alter table "loads" add column "internal_broker_name" varchar(255) null;',
    );
    this.addSql(
      'comment on column "loads"."internal_broker_name" is \'The broker name from our internal service\';',
    );
  }

  async down(): Promise<void> {
    this.addSql('alter table "loads" drop column "internal_broker_name";');
  }
}
