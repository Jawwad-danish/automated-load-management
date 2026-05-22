export class S3ObjectLocator {
  private readonly key: string;
  private readonly bucket: string;

  constructor(bucket: string, key: string, encode = false) {
    this.bucket = bucket;
    this.key = encode ? encodeURIComponent(key) : key;
  }

  getKey(): string {
    return this.key;
  }

  getBucket(): string {
    return this.bucket;
  }
}
