import { SESMessage, SNSMessage, SQSEvent } from 'aws-lambda';
import { LambdaApp } from '../core';
import { EmailParser } from './email-parser';

let app: LambdaApp;
let emailParser: EmailParser;

export const handler = async (event: SQSEvent): Promise<any> => {
  console.log('Handling event', JSON.stringify(event));
  if (!app) {
    app = new LambdaApp();
  }
  if (!emailParser) {
    emailParser = new EmailParser(app);
  }

  const messages = event.Records.map((e) => JSON.parse(e.body) as SNSMessage)
    .map((item) => JSON.parse(item.Message))
    .filter((message) => {
      const result = 'mail' in message;
      if (!result) {
        console.log(`Ignoring message of type ${message.notificationType}`);
      }
      return result;
    })
    .map((message) => message as SESMessage);

  for (const message of messages) {
    const action = message.receipt.action;
    if (!app.s3Manager.isS3Action(action)) {
      console.warn('Received a message with a receipt action that is not S3');
      continue;
    }
    const response = await emailParser.parse(action);
    const logData = {
      from: response.from,
      subject: response.subject,
      s3Location: `${response.s3Bucket}/${response.s3Key}`,
    };
    console.log(`Sending parsed email to sqs - ${JSON.stringify(logData)}`);
    await app.sqsManager.sendMessage(response);
  }
  return { message: 'done' };
};
