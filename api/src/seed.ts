import { RequestContext } from '@mikro-orm/core';
import { DatabaseModule, DatabaseService } from '@module-database';
import {
  DocumentEntity,
  DocumentStatus,
  DocumentSubmissionType,
  DocumentType,
  EmailEntity,
  FactoredStatus,
  LoadEntity,
} from '@module-persistence/entities';
import { NestFactory } from '@nestjs/core';
import Big from 'big.js';
import { v4 as uuidv4 } from 'uuid';

class Seed {
  constructor(private readonly databaseService: DatabaseService) {}

  run() {
    const em = this.databaseService.getMikroORM().em;
    const email = this.buildEmail();
    em.persistAndFlush(email);
  }

  private buildEmail() {
    const email = new EmailEntity();
    email.messageId = uuidv4();
    email.fromEmail = 'email@bobtailtest.com';
    email.fromName = 'email';
    email.subject = 'subject';
    email.body = 'body';
    email.s3Bucket = 'bucket';
    email.s3Key = 'key';
    email.load = this.buildLoad();
    return email;
  }

  private buildLoad() {
    const load = new LoadEntity();
    load.loadNumber = 'load';
    load.clientId = uuidv4();
    load.brokerId = uuidv4();
    load.brokerName = 'Broker';
    load.brokerEmail = 'broker@bobtailtest.com';
    load.documentStatus = DocumentStatus.Uploaded;
    load.factoredStatus = FactoredStatus.Factored;
    load.invoiceId = uuidv4();
    load.totalAmount = new Big(1000);
    load.documents.add(this.buildDocument());
    return load;
  }

  private buildDocument() {
    const document = new DocumentEntity();
    document.name = 'rate.pdf';
    document.filestackUrl = 'http://localhost';
    document.label = 'rate';
    document.s3Bucket = 'bucket';
    document.s3Key = 'key';
    document.submissionType = DocumentSubmissionType.Email;
    document.type = DocumentType.RateConfirmation;
    return document;
  }
}

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(DatabaseModule);
  const databaseService = app.get(DatabaseService);
  RequestContext.create(databaseService.getMikroORM().em, () => {
    new Seed(databaseService).run();
  });
  await app.close();
}

bootstrap();
