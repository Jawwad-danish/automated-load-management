import { S3Manager } from './s3';
import { SQSManager } from './sqs';

export class LambdaApp {
  readonly s3Manager: S3Manager;
  readonly sqsManager: SQSManager;

  constructor() {
    const emailParsedQueueUrl = process.env['EMAIL_PARSED_QUEUE_URL'];
    if (!emailParsedQueueUrl) {
      throw new Error('Missing EMAIL_PARSED_QUEUE_URL env variable');
    }

    this.s3Manager = new S3Manager();
    this.sqsManager = new SQSManager(emailParsedQueueUrl);
  }
}
