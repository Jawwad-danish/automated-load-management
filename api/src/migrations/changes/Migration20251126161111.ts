import { Migration } from '@mikro-orm/migrations';

export class Migration20251126161111 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'alter table "drivers" alter column "name" type text using ("name"::text);',
    );
    this.addSql(
      'alter table "drivers" alter column "phone_number" type text using ("phone_number"::text);',
    );

    this.addSql(
      'alter table "emails" alter column "from_email" type text using ("from_email"::text);',
    );
    this.addSql(
      'alter table "emails" alter column "from_name" type text using ("from_name"::text);',
    );
    this.addSql(
      'alter table "emails" alter column "subject" type text using ("subject"::text);',
    );
    this.addSql(
      'alter table "emails" alter column "s3bucket" type text using ("s3bucket"::text);',
    );
    this.addSql(
      'alter table "emails" alter column "s3key" type text using ("s3key"::text);',
    );
    this.addSql(
      'alter table "emails" alter column "message_id" type text using ("message_id"::text);',
    );

    this.addSql(
      'alter table "email_attachments" alter column "file_name" type text using ("file_name"::text);',
    );
    this.addSql(
      'alter table "email_attachments" alter column "content_type" type text using ("content_type"::text);',
    );
    this.addSql(
      'alter table "email_attachments" alter column "s3bucket" type text using ("s3bucket"::text);',
    );
    this.addSql(
      'alter table "email_attachments" alter column "s3key" type text using ("s3key"::text);',
    );

    this.addSql(
      'alter table "loads" alter column "broker_name" type text using ("broker_name"::text);',
    );
    this.addSql(
      'alter table "loads" alter column "broker_email" type text using ("broker_email"::text);',
    );
    this.addSql(
      'alter table "loads" alter column "load_number" type text using ("load_number"::text);',
    );
    this.addSql(
      'alter table "loads" alter column "internal_broker_name" type text using ("internal_broker_name"::text);',
    );

    this.addSql(
      'alter table "document_requests" alter column "driver_name" type text using ("driver_name"::text);',
    );
    this.addSql(
      'alter table "document_requests" alter column "driver_phone_number" type text using ("driver_phone_number"::text);',
    );
    this.addSql(
      'alter table "document_requests" alter column "url" type text using ("url"::text);',
    );

    this.addSql(
      'alter table "documents" alter column "s3bucket" type text using ("s3bucket"::text);',
    );
    this.addSql(
      'alter table "documents" alter column "s3key" type text using ("s3key"::text);',
    );

    this.addSql(
      'alter table "addresses" alter column "full_address" type text using ("full_address"::text);',
    );
    this.addSql(
      'alter table "addresses" alter column "city" type text using ("city"::text);',
    );
    this.addSql(
      'alter table "addresses" alter column "state" type text using ("state"::text);',
    );

    this.addSql(
      'alter table "tag_definitions" alter column "name" type text using ("name"::text);',
    );
    this.addSql(
      'alter table "tag_definitions" alter column "key" type text using ("key"::text);',
    );
    this.addSql(
      'alter table "tag_definitions" alter column "note" type text using ("note"::text);',
    );

    this.addSql(
      'alter table "tag_definition_group" alter column "name" type text using ("name"::text);',
    );
    this.addSql(
      'alter table "tag_definition_group" alter column "key" type text using ("key"::text);',
    );
  }

  async down(): Promise<void> {
    this.addSql(
      'alter table "addresses" alter column "full_address" type varchar(255) using ("full_address"::varchar(255));',
    );
    this.addSql(
      'alter table "addresses" alter column "city" type varchar(255) using ("city"::varchar(255));',
    );
    this.addSql(
      'alter table "addresses" alter column "state" type varchar(255) using ("state"::varchar(255));',
    );

    this.addSql(
      'alter table "document_requests" alter column "driver_name" type varchar(255) using ("driver_name"::varchar(255));',
    );
    this.addSql(
      'alter table "document_requests" alter column "driver_phone_number" type varchar(255) using ("driver_phone_number"::varchar(255));',
    );
    this.addSql(
      'alter table "document_requests" alter column "url" type varchar(255) using ("url"::varchar(255));',
    );

    this.addSql(
      'alter table "documents" alter column "s3bucket" type varchar(255) using ("s3bucket"::varchar(255));',
    );
    this.addSql(
      'alter table "documents" alter column "s3key" type varchar(255) using ("s3key"::varchar(255));',
    );

    this.addSql(
      'alter table "drivers" alter column "name" type varchar(255) using ("name"::varchar(255));',
    );
    this.addSql(
      'alter table "drivers" alter column "phone_number" type varchar(255) using ("phone_number"::varchar(255));',
    );

    this.addSql(
      'alter table "email_attachments" alter column "file_name" type varchar(255) using ("file_name"::varchar(255));',
    );
    this.addSql(
      'alter table "email_attachments" alter column "content_type" type varchar(255) using ("content_type"::varchar(255));',
    );
    this.addSql(
      'alter table "email_attachments" alter column "s3bucket" type varchar(255) using ("s3bucket"::varchar(255));',
    );
    this.addSql(
      'alter table "email_attachments" alter column "s3key" type varchar(255) using ("s3key"::varchar(255));',
    );

    this.addSql(
      'alter table "emails" alter column "from_email" type varchar(255) using ("from_email"::varchar(255));',
    );
    this.addSql(
      'alter table "emails" alter column "from_name" type varchar(255) using ("from_name"::varchar(255));',
    );
    this.addSql(
      'alter table "emails" alter column "subject" type varchar(255) using ("subject"::varchar(255));',
    );
    this.addSql(
      'alter table "emails" alter column "s3bucket" type varchar(255) using ("s3bucket"::varchar(255));',
    );
    this.addSql(
      'alter table "emails" alter column "s3key" type varchar(255) using ("s3key"::varchar(255));',
    );
    this.addSql(
      'alter table "emails" alter column "message_id" type varchar(255) using ("message_id"::varchar(255));',
    );

    this.addSql(
      'alter table "loads" alter column "broker_name" type varchar(255) using ("broker_name"::varchar(255));',
    );
    this.addSql(
      'alter table "loads" alter column "internal_broker_name" type varchar(255) using ("internal_broker_name"::varchar(255));',
    );
    this.addSql(
      'alter table "loads" alter column "broker_email" type varchar(255) using ("broker_email"::varchar(255));',
    );
    this.addSql(
      'alter table "loads" alter column "load_number" type varchar(255) using ("load_number"::varchar(255));',
    );

    this.addSql(
      'alter table "tag_definition_group" alter column "name" type varchar(255) using ("name"::varchar(255));',
    );
    this.addSql(
      'alter table "tag_definition_group" alter column "key" type varchar(255) using ("key"::varchar(255));',
    );

    this.addSql(
      'alter table "tag_definitions" alter column "name" type varchar(255) using ("name"::varchar(255));',
    );
    this.addSql(
      'alter table "tag_definitions" alter column "key" type varchar(255) using ("key"::varchar(255));',
    );
    this.addSql(
      'alter table "tag_definitions" alter column "note" type varchar(255) using ("note"::varchar(255));',
    );
  }
}
