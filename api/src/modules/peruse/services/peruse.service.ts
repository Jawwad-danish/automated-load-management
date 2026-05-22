import { S3Service } from '@module-aws';
import {
  EmailAttachmentEntity,
  JobEntityType,
  PeruseJobRepository,
} from '@module-persistence';
import { HttpService } from '@nestjs/axios';
import { Injectable, OnModuleInit } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { firstValueFrom } from 'rxjs';
import { Arrays } from '../../../core';
import {
  ClassifyRequest,
  PeruseClassificationJobResponse,
  PeruseJobMapper,
} from '../data';
import { PeruseConfig, PeruseConfigSupplier } from './peruse-config.supplier';
import {
  PeruseCreateLoadJobResponse,
  PeruseLoadResponse,
} from '../data/create-load-job';

export interface ClassifyInput {
  externalId: string;
  s3Key: string;
  s3Bucket: string;
  type: JobEntityType;
  extract: boolean;
}

export interface CreateLoadInput {
  externalId: string;
  s3Key: string;
  s3Bucket: string;
}

@Injectable()
export class PeruseService implements OnModuleInit {
  private config: PeruseConfig;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: PeruseConfigSupplier,
    private readonly s3Service: S3Service,
    private readonly repository: PeruseJobRepository,
    private readonly mapper: PeruseJobMapper,
  ) {}

  async onModuleInit() {
    this.config = await this.configService.get();
  }

  async classifyDocument({
    externalId,
    s3Bucket,
    s3Key,
    type,
    extract,
  }: ClassifyInput): Promise<PeruseClassificationJobResponse> {
    const documentUrl = await this.s3Service.getSignedUrl(s3Key, s3Bucket);
    const result = await this.classify(externalId, documentUrl, extract);
    this.repository.persist(this.mapper.responseToJobEntity(result, type));
    return result;
  }

  async createLoadFromAttachments(
    attachments: EmailAttachmentEntity[],
  ): Promise<any> {
    const result = await this.createLoad(
      attachments.map((attachment) => {
        return {
          externalId: attachment.id,
          s3Key: attachment.s3Key,
          s3Bucket: attachment.s3Bucket,
        };
      }),
    );
    this.repository.persist(
      this.mapper.responseToJobEntity(result, JobEntityType.Attachment),
    );

    return result;
  }

  private async createLoad(
    items: CreateLoadInput[],
  ): Promise<PeruseCreateLoadJobResponse> {
    const documents = await Arrays.mapAsync(items, async (attachment) => {
      return {
        externalId: attachment.externalId,
        url: await this.s3Service.getSignedUrl(
          attachment.s3Key,
          attachment.s3Bucket,
        ),
      };
    });
    const payload = {
      documents: documents.map((doc) => {
        return {
          document_ref: doc.url,
          external_id: doc.externalId,
        };
      }),
    };
    const response = await firstValueFrom(
      this.httpService.post(`${this.config.url}/v2/create-load`, payload, {
        headers: { 'x-api-key': this.config.apiKey },
      }),
    );
    return plainToInstance(PeruseCreateLoadJobResponse, response.data);
  }

  async getJob(jobId: string): Promise<any> {
    const response = await firstValueFrom(
      this.httpService.get(`${this.config.url}/v2/job/${jobId}`, {
        headers: { 'x-api-key': this.config.apiKey },
      }),
    );

    return response.data;
  }

  async getLoad(loadId: string): Promise<PeruseLoadResponse> {
    const response = await firstValueFrom(
      this.httpService.get(`${this.config.url}/v2/load/${loadId}`, {
        headers: { 'x-api-key': this.config.apiKey },
      }),
    );

    return plainToInstance(PeruseLoadResponse, response.data);
  }

  private async classify(
    externalId: string,
    documentUrl: string,
    extract: boolean,
  ): Promise<PeruseClassificationJobResponse> {
    const body: ClassifyRequest = {
      document: {
        external_id: externalId,
        url: documentUrl,
      },
      extract: extract,
    };

    const response = await firstValueFrom(
      this.httpService.post(`${this.config.url}/v2/classify`, body, {
        headers: { 'x-api-key': this.config.apiKey },
      }),
    );

    return plainToInstance(PeruseClassificationJobResponse, response.data);
  }
}
