import { SESReceiptS3Action } from 'aws-lambda';
import { Attachment, ParsedMail, simpleParser } from 'mailparser';
import { Readable } from 'stream';
import { v4 as uuidv4 } from 'uuid';
import { LambdaApp, S3ObjectLocator } from '../core';
import { EmailAttachment, EmailResponse } from './email-response';
import { PutObjectCommandOutput } from '@aws-sdk/client-s3';

export class EmailParser {
  constructor(private readonly app: LambdaApp) {}

  async parse(action: SESReceiptS3Action): Promise<EmailResponse> {
    console.log(
      `Extracting attachments from ${action.bucketName}/${action.objectKey}`,
    );
    const rawEmailLocation = new S3ObjectLocator(
      action.bucketName,
      action.objectKey,
    );
    const rawEmailS3Object =
      await this.app.s3Manager.getObject(rawEmailLocation);
    console.log(`Parsing email from ${action.bucketName}/${action.objectKey}`);
    const parsedMail = await simpleParser(rawEmailS3Object.Body as Readable);
    const response = this.toEmailResponse(parsedMail, rawEmailLocation);
    console.log(
      `Storing attachments to s3 for email ${action.bucketName}/${action.objectKey}`,
    );
    const attachmentS3Promises: Promise<PutObjectCommandOutput>[] = [];
    for (const attachment of parsedMail.attachments) {
      const attachmentLocation = new S3ObjectLocator(
        action.bucketName,
        `attachments/${action.objectKey.split('/').splice(-1)}_${attachment.filename || uuidv4()}`,
      );
      response.attachments.push(
        this.toEmailAttachment(attachment, attachmentLocation),
      );
      attachmentS3Promises.push(
        this.app.s3Manager.putObject(
          {
            data: attachment.content,
            type: attachment.contentType,
            length: attachment.size,
          },
          attachmentLocation,
        ),
      );
    }
    const s3Attachments = await Promise.all(attachmentS3Promises);
    console.log(
      `Done storing ${s3Attachments.length} attachments to s3 for email ${action.bucketName}/${action.objectKey}`,
    );
    return response;
  }

  toEmailResponse(
    parsedEmail: ParsedMail,
    location: S3ObjectLocator,
  ): EmailResponse {
    const htmlBody = parsedEmail.html || null;
    const fromEmail = parsedEmail.from?.value[0]?.address || null;
    console.log(`Converting to email response. Email sender: ${fromEmail}`);
    let subject = parsedEmail.subject || null;
    if (htmlBody && htmlBody.includes('Forwarded message')) {
      const subjectMatch = htmlBody.match(/Subject: ([^<]+)<br>/);
      subject = subjectMatch ? subjectMatch[1] : null;
    }
    const response = new EmailResponse();
    response.emailId = parsedEmail.messageId || null;
    response.subject = subject;
    response.from = fromEmail;
    response.s3Bucket = location.getBucket();
    response.s3Key = location.getKey();
    return response;
  }

  private toEmailAttachment(
    parsedAttachment: Attachment,
    location: S3ObjectLocator,
  ): EmailAttachment {
    const attachment = new EmailAttachment();
    attachment.filename = parsedAttachment.filename || null;
    attachment.s3Bucket = location.getBucket();
    attachment.s3Key = location.getKey();
    return attachment;
  }
}
