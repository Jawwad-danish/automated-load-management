import { GetObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { environment } from '@core/environment';
import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class S3Service {
  private readonly logger: Logger = new Logger(S3Service.name);
  private readonly client: S3Client = new S3Client({
    region: environment.aws.defaultRegion(),
  });

  async getSignedUrl(key: string, bucket: string): Promise<string> {
    this.logger.debug(
      `Generating presigned URL for item ${key} from bucket ${bucket}`,
    );
    const command = new GetObjectCommand({ Bucket: bucket, Key: key });
    return getSignedUrl(this.client, command, { expiresIn: 3600 });
  }

  async getPublicUrl(key: string, bucket: string): Promise<string> {
    this.logger.debug(
      `Generating public URL for item ${key} from bucket ${bucket}`,
    );
    if (bucket.includes('loads-emails')) {
      return await this.getSignedUrl(key, bucket);
    }
    return `https://${bucket}.s3.${environment.aws.defaultRegion()}.amazonaws.com/${key}`;
  }
}
