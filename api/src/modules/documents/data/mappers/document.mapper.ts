import { environment } from '@core/environment';
import { DataMapper } from '@core/mapping';
import { S3Service } from '@module-aws';
import { Filestack } from '@module-filestack';
import {
  DocumentEntity,
  DocumentSubmissionType,
} from '@module-persistence/entities';
import { Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { Document, UploadDocumentRequest } from '../web';

@Injectable()
export class DocumentMapper implements DataMapper<DocumentEntity, any> {
  constructor(
    private readonly s3Service: S3Service,
    private readonly filestack: Filestack,
  ) {}
  async entityToModel(entity: DocumentEntity): Promise<Document> {
    let url: string = 'http://local-dev-placeholder.com';
    if (
      !(
        environment.isLocal() ||
        environment.isTest() ||
        environment.isIntegration()
      )
    ) {
      url = await this.s3Service.getPublicUrl(entity.s3Key, entity.s3Bucket);
    }
    let driverName: string;
    if (entity.documentRequestLink.length > 0) {
      driverName = entity.documentRequestLink[0].documentRequest.driverName;
    }
    return new Document({
      id: entity.id,
      name: entity.name,
      type: entity.type,
      label: entity.label,
      driverName: driverName,
      url: url,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    });
  }

  async uploadDocumentToEntity(
    request: UploadDocumentRequest,
  ): Promise<DocumentEntity> {
    const entity = new DocumentEntity();
    entity.id = uuidv4();
    entity.label = request.label;
    entity.filestackUrl = request.filestackUrl;
    entity.name = request.name;
    entity.type = request.type;
    entity.submissionType = DocumentSubmissionType.Upload;
    const { s3Key, s3Bucket } = await this.filestack.getStorage(
      request.filestackUrl,
    );
    entity.s3Bucket = s3Bucket;
    entity.s3Key = s3Key;
    return entity;
  }
}
