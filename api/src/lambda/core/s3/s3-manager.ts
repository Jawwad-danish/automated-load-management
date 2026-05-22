import {
  GetObjectCommand,
  GetObjectCommandOutput,
  PutObjectCommand,
  PutObjectCommandOutput,
  S3Client,
} from '@aws-sdk/client-s3';
import {
  SESReceiptBounceAction,
  SESReceiptLambdaAction,
  SESReceiptS3Action,
  SESReceiptSnsAction,
  SESReceiptStopAction,
  SESReceiptWorkMailAction,
} from 'aws-lambda';
import { S3ObjectLocator } from './s3-object-locator';

interface ContentParams {
  data: string | Buffer;
  type?: string;
  length?: number;
}

export class S3Manager {
  private readonly client: S3Client;

  constructor() {
    this.client = new S3Client({
      region: 'us-east-1',
    });
  }

  isS3Action(
    action:
      | SESReceiptS3Action
      | SESReceiptSnsAction
      | SESReceiptBounceAction
      | SESReceiptLambdaAction
      | SESReceiptStopAction
      | SESReceiptWorkMailAction,
  ): action is SESReceiptS3Action {
    return action.type === 'S3';
  }

  async getObject(source: S3ObjectLocator): Promise<GetObjectCommandOutput> {
    try {
      const command = new GetObjectCommand({
        Bucket: source.getBucket(),
        Key: source.getKey(),
      });

      const result = await this.client.send(command);
      console.log(
        `Fetched s3 object from ${source.getBucket()}/${source.getKey()}`,
      );
      return result;
    } catch (error) {
      console.error(
        `Could not fetch object from bucket ${source.getBucket()} with key ${source.getKey()}`,
        error,
      );
      throw error;
    }
  }

  async putObject(
    content: ContentParams,
    destination: S3ObjectLocator,
  ): Promise<PutObjectCommandOutput> {
    try {
      const command = new PutObjectCommand({
        Body: content.data,
        Bucket: destination.getBucket(),
        Key: destination.getKey(),
        ContentType: content.type,
        ContentLength: content.length,
      });
      const result = await this.client.send(command);
      console.log(
        `Put object to ${destination.getBucket()}/${destination.getKey()}`,
      );
      return result;
    } catch (error) {
      console.error(
        `Could not put object with key ${destination.getKey()} to bucket ${destination.getBucket()}`,
      );
      throw error;
    }
  }
}
