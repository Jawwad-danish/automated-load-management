export class EmailAttachment {
  filename: null | string;
  s3Bucket: string;
  s3Key: string;
}

export class EmailResponse {
  emailId: null | string;
  subject: null | string;
  from: null | string;
  s3Bucket: string;
  s3Key: string;
  attachments: EmailAttachment[] = [];
}
