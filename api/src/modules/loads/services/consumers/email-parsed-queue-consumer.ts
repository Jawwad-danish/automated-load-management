import { Message } from '@aws-sdk/client-sqs';
import { environment, generateUniqueId } from '@core';
import { CONFIG_SERVICE, ConfigService } from '@module-config';
import { DatabaseService, Transactional } from '@module-database';
import {
  EmailAttachmentEntity,
  EmailEntity,
  EmailRepository,
} from '@module-persistence';
import { PeruseService } from '@module-peruse';
import { SegmentEvents, SegmentService } from '@module-segment';
import {
  Inject,
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { Consumer } from 'sqs-consumer';

export const QUEUE_URL_KEY = 'EMAIL_PARSED_NOTIFICATION_QUEUE_URL';

@Injectable()
export class EmailParsedQueueConsumer implements OnModuleInit, OnModuleDestroy {
  private sqsConsumer: Consumer;
  private logger = new Logger(EmailParsedQueueConsumer.name);

  constructor(
    @Inject(CONFIG_SERVICE) private configService: ConfigService,
    private readonly databaseService: DatabaseService,
    private readonly emailRepository: EmailRepository,
    private readonly peruseService: PeruseService,
    private readonly analytics: SegmentService,
  ) {}

  async onModuleInit() {
    const queueUrl = this.configService.getValue(QUEUE_URL_KEY);
    if (!queueUrl.hasValue()) {
      this.logger.error(
        'Email Documents Queue URL is not defined. SQS consumer was not initiated',
      );
      return;
    }

    this.logger.log(`Starting SQS consumer for queue ${queueUrl.asString()}`);
    this.sqsConsumer = Consumer.create({
      region: environment.aws.defaultRegion(),
      queueUrl: queueUrl.asString(),
      handleMessage: this.handleMessage.bind(this),
    });
    this.sqsConsumer.start();
  }

  async onModuleDestroy() {
    if (this.sqsConsumer) {
      this.sqsConsumer.stop();
    }
  }

  async handleMessage(message: Message): Promise<Message | void> {
    try {
      this.logger.log(`Consuming message ${message.MessageId}`);
      const parsedBody = JSON.parse(message.Body);
      const email = this.messageToEmailEntity(message.MessageId, parsedBody);
      if (email.attachments.length > 0) {
        await this.databaseService.withRequestContext(async () => {
          return this.createEmail(email);
        });
      }
      return message;
    } catch (error) {
      this.logger.error(`Error while handling SQS message - ${error}`);
      let id = 'id not found';
      if (!(error instanceof SyntaxError)) {
        id = JSON.parse(message.Body).fromEmail;
      }
      this.analytics.track(id, SegmentEvents.LoadNotCreated, {
        reason: `${error.message}`,
      });
    }
  }

  @Transactional('email-document-processing')
  private async createEmail(email: EmailEntity): Promise<void> {
    this.emailRepository.persist(email);
    await this.peruseService.createLoadFromAttachments(
      email.attachments.getItems(),
    );
  }

  private messageToEmailEntity(messageId: string, body: any): EmailEntity {
    const email = new EmailEntity();
    email.id = generateUniqueId();
    email.body = body.body || '';
    email.subject = body.subject;
    email.fromEmail = body.from;
    email.s3Bucket = body.s3Bucket;
    email.s3Key = body.s3Key;
    email.messageId = messageId;

    for (const attachment of body.attachments) {
      const entity = new EmailAttachmentEntity();
      entity.id = generateUniqueId();
      entity.s3Bucket = attachment.s3Bucket;
      entity.s3Key = attachment.s3Key;
      entity.fileName = attachment.filename;
      entity.contentType = 'to_be_determined';
      email.attachments.add(entity);
    }
    return email;
  }
}
