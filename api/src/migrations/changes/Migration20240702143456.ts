import { Migration } from '@mikro-orm/migrations';

const extensions = ['uuid-ossp', 'pg_trgm'];

export class Migration20240702143456 extends Migration {
  async up(): Promise<void> {
    for (const extension of extensions) {
      this.addSql(`CREATE EXTENSION IF NOT EXISTS "${extension}"`);
    }
  }

  async down(): Promise<void> {}
}
