import { Migration } from '@mikro-orm/migrations';

export class Migration20240808142426 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'create table "drivers" ("id" uuid not null default uuid_generate_v4(), "created_at" timestamptz(3) not null, "record_status" text check ("record_status" in (\'Active\', \'Inactive\')) not null default \'Active\', "updated_at" timestamptz(3) not null, "client_id" uuid not null, "name" varchar(255) not null, "phone_number" varchar(255) not null, constraint "drivers_pkey" primary key ("id"));',
    );

    this.addSql(
      'create table "emails" ("id" uuid not null default uuid_generate_v4(), "created_at" timestamptz(3) not null, "record_status" text check ("record_status" in (\'Active\', \'Inactive\')) not null default \'Active\', "updated_at" timestamptz(3) not null, "from_email" varchar(255) not null, "from_name" varchar(255) null, "subject" varchar(255) null, "body" text not null, "s3bucket" varchar(255) not null, "s3key" varchar(255) not null, "message_id" varchar(255) not null, constraint "emails_pkey" primary key ("id"));',
    );

    this.addSql(
      'create table "email_attachments" ("id" uuid not null default uuid_generate_v4(), "created_at" timestamptz(3) not null, "record_status" text check ("record_status" in (\'Active\', \'Inactive\')) not null default \'Active\', "updated_at" timestamptz(3) not null, "file_name" varchar(255) not null, "content_type" varchar(255) not null, "s3bucket" varchar(255) not null, "s3key" varchar(255) not null, "email_id" uuid not null, constraint "email_attachments_pkey" primary key ("id"));',
    );
    this.addSql(
      'create index "email_attachments_email_id_index" on "email_attachments" ("email_id");',
    );

    this.addSql(
      'create table "loads" ("id" uuid not null default uuid_generate_v4(), "created_at" timestamptz(3) not null, "record_status" text check ("record_status" in (\'Active\', \'Inactive\')) not null default \'Active\', "updated_at" timestamptz(3) not null, "client_id" uuid not null, "broker_id" uuid null, "broker_name" varchar(255) null, "broker_email" varchar(255) null, "load_number" varchar(255) not null, "total_amount" numeric not null default 0, "document_status" text check ("document_status" in (\'requested\', \'received\', \'uploaded\', \'none\')) not null default \'none\', "factored_status" text check ("factored_status" in (\'factored\', \'none\')) not null default \'none\', "invoice_id" uuid null, "email_id" uuid not null, constraint "loads_pkey" primary key ("id"));',
    );
    this.addSql(
      'alter table "loads" add constraint "loads_email_id_unique" unique ("email_id");',
    );

    this.addSql(
      'create table "document_requests" ("id" uuid not null default uuid_generate_v4(), "created_at" timestamptz(3) not null, "record_status" text check ("record_status" in (\'Active\', \'Inactive\')) not null default \'Active\', "updated_at" timestamptz(3) not null, "status" text check ("status" in (\'sent\', \'received\', \'expired\', \'failed\')) null, "driver_id" uuid null, "driver_name" varchar(255) null, "driver_phone_number" varchar(255) not null, "url" varchar(255) not null, "load_id" uuid not null, constraint "document_requests_pkey" primary key ("id"));',
    );
    this.addSql(
      'create index "document_requests_load_id_index" on "document_requests" ("load_id");',
    );

    this.addSql(
      'create table "documents" ("id" uuid not null default uuid_generate_v4(), "created_at" timestamptz(3) not null, "record_status" text check ("record_status" in (\'Active\', \'Inactive\')) not null default \'Active\', "updated_at" timestamptz(3) not null, "name" varchar(255) not null, "s3bucket" varchar(255) not null, "s3key" varchar(255) not null, "type" text check ("type" in (\'rate_confirmation\', \'bill_of_lading\', \'lumper_receipt\', \'scale_ticket\')) null, "submission_type" text check ("submission_type" in (\'upload\', \'request\', \'email\')) null, "filestack_url" varchar(255) null, "label" varchar(255) not null, "load_id" uuid not null, constraint "documents_pkey" primary key ("id"));',
    );
    this.addSql(
      'create index "documents_load_id_index" on "documents" ("load_id");',
    );

    this.addSql(
      'create table "document_requests_links" ("id" uuid not null default uuid_generate_v4(), "created_at" timestamptz(3) not null, "record_status" text check ("record_status" in (\'Active\', \'Inactive\')) not null default \'Active\', "updated_at" timestamptz(3) not null, "document_request_id" uuid not null, "document_id" uuid not null, constraint "document_requests_links_pkey" primary key ("id"));',
    );
    this.addSql(
      'create index "document_requests_links_document_request_id_index" on "document_requests_links" ("document_request_id");',
    );
    this.addSql(
      'create index "document_requests_links_document_id_index" on "document_requests_links" ("document_id");',
    );

    this.addSql(
      'create table "addresses" ("id" uuid not null default uuid_generate_v4(), "created_at" timestamptz(3) not null, "record_status" text check ("record_status" in (\'Active\', \'Inactive\')) not null default \'Active\', "updated_at" timestamptz(3) not null, "full_address" varchar(255) not null, "city" varchar(255) not null, "state" varchar(255) not null, "type" text check ("type" in (\'pickup\', \'delivery\')) not null, "date" timestamptz(3) null, "load_id" uuid not null, constraint "addresses_pkey" primary key ("id"));',
    );
    this.addSql(
      'create index "addresses_load_id_index" on "addresses" ("load_id");',
    );

    this.addSql(
      'create table "peruse_documents_results" ("id" uuid not null default uuid_generate_v4(), "created_at" timestamptz(3) not null, "record_status" text check ("record_status" in (\'Active\', \'Inactive\')) not null default \'Active\', "payload" jsonb not null, "status" text check ("status" in (\'success\', \'error\', \'pending\')) not null, "document_id" uuid not null, constraint "peruse_documents_results_pkey" primary key ("id"));',
    );
    this.addSql(
      'create index "peruse_documents_results_document_id_index" on "peruse_documents_results" ("document_id");',
    );

    this.addSql(
      'alter table "email_attachments" add constraint "email_attachments_email_id_foreign" foreign key ("email_id") references "emails" ("id") on update cascade;',
    );

    this.addSql(
      'alter table "loads" add constraint "loads_email_id_foreign" foreign key ("email_id") references "emails" ("id") on update cascade;',
    );

    this.addSql(
      'alter table "document_requests" add constraint "document_requests_load_id_foreign" foreign key ("load_id") references "loads" ("id") on update cascade;',
    );

    this.addSql(
      'alter table "documents" add constraint "documents_load_id_foreign" foreign key ("load_id") references "loads" ("id") on update cascade;',
    );

    this.addSql(
      'alter table "document_requests_links" add constraint "document_requests_links_document_request_id_foreign" foreign key ("document_request_id") references "document_requests" ("id") on update cascade;',
    );
    this.addSql(
      'alter table "document_requests_links" add constraint "document_requests_links_document_id_foreign" foreign key ("document_id") references "documents" ("id") on update cascade;',
    );

    this.addSql(
      'alter table "addresses" add constraint "addresses_load_id_foreign" foreign key ("load_id") references "loads" ("id") on update cascade;',
    );

    this.addSql(
      'alter table "peruse_documents_results" add constraint "peruse_documents_results_document_id_foreign" foreign key ("document_id") references "documents" ("id") on update cascade;',
    );
  }

  async down(): Promise<void> {
    this.addSql(
      'alter table "email_attachments" drop constraint "email_attachments_email_id_foreign";',
    );

    this.addSql(
      'alter table "loads" drop constraint "loads_email_id_foreign";',
    );

    this.addSql(
      'alter table "document_requests" drop constraint "document_requests_load_id_foreign";',
    );

    this.addSql(
      'alter table "documents" drop constraint "documents_load_id_foreign";',
    );

    this.addSql(
      'alter table "addresses" drop constraint "addresses_load_id_foreign";',
    );

    this.addSql(
      'alter table "document_requests_links" drop constraint "document_requests_links_document_request_id_foreign";',
    );

    this.addSql(
      'alter table "document_requests_links" drop constraint "document_requests_links_document_id_foreign";',
    );

    this.addSql(
      'alter table "peruse_documents_results" drop constraint "peruse_documents_results_document_id_foreign";',
    );

    this.addSql('drop table if exists "drivers" cascade;');

    this.addSql('drop table if exists "emails" cascade;');

    this.addSql('drop table if exists "email_attachments" cascade;');

    this.addSql('drop table if exists "loads" cascade;');

    this.addSql('drop table if exists "document_requests" cascade;');

    this.addSql('drop table if exists "documents" cascade;');

    this.addSql('drop table if exists "document_requests_links" cascade;');

    this.addSql('drop table if exists "addresses" cascade;');

    this.addSql('drop table if exists "peruse_documents_results" cascade;');
  }
}
