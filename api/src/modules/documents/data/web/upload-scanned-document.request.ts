import { BaseModel } from '@core/data';
import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { IsArray, IsNotEmpty, IsUUID, ValidateNested } from 'class-validator';
import { UploadDocumentRequest } from './upload-document.request';

export class UploadScannedDocumentRequest extends BaseModel<UploadScannedDocumentRequest> {
  @ApiProperty({
    title: 'Document type',
    description: 'The type of the document',
  })
  @IsNotEmpty()
  @IsUUID()
  @Expose()
  requestId: string;

  @ApiProperty({
    title: 'Scanned documents',
    description: 'Scanned documents to be uploaded',
  })
  @IsNotEmpty()
  @IsArray()
  @ValidateNested()
  @Expose()
  @Type(() => UploadDocumentRequest)
  documentsRequest: UploadDocumentRequest[];
}
