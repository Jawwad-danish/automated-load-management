import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import * as filestack from 'filestack-js';

import {
  FilestackConfig,
  FilestackConfigSupplier,
} from './filestack-config.supplier';
import axios from 'axios';

export interface FilestackStorage {
  s3Key: string;
  s3Bucket: string;
}

export type TransformResponse = {
  container: string;
  filename: string;
  handle: string;
  key: string;
  size: number;
  type: string;
  url: string;
};

@Injectable()
export class Filestack implements OnModuleInit {
  logger = new Logger(Filestack.name);
  private client: filestack.Client;
  private config: FilestackConfig;

  constructor(
    private readonly filestackConfigSupplier: FilestackConfigSupplier,
  ) {}

  async onModuleInit() {
    this.config = await this.filestackConfigSupplier.get();
    this.client = filestack.init(this.config.key);
  }

  async getStorage(url: string): Promise<FilestackStorage> {
    const fileHandle = url.substring(url.lastIndexOf('/') + 1);
    const metadata = await this.client.metadata(fileHandle);
    return {
      s3Bucket: metadata.container,
      s3Key: metadata.key,
    };
  }

  async convertImageToPdf(filestackUrl: string): Promise<TransformResponse> {
    const fileHandle = filestackUrl.substring(
      filestackUrl.lastIndexOf('/') + 1,
    );
    const transformUrl = this.client.transform(fileHandle, {
      security: this.buildSecurity(fileHandle),
      output: {
        format: 'pdf',
      },
      store: {},
    });
    try {
      const result = await axios.get(transformUrl);
      return result.data as TransformResponse;
    } catch (error) {
      console.error(`Could not convert image URL ${filestackUrl} to PDF`);
      throw error;
    }
  }

  private buildSecurity(fileHandle: string) {
    const expiration = new Date();
    expiration.setHours(expiration.getHours() + 1);
    return filestack.getSecurity(
      {
        expiry: expiration.getTime() / 1000,
        handle: fileHandle,
      },
      this.config.secret,
    );
  }
}
