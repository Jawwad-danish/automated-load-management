import { BaseModel } from '@core/data';
import { DocumentType } from '@module-persistence/entities';
import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsEnum, IsNotEmpty, IsString, IsUrl } from 'class-validator';

export class UploadDocumentRequest extends BaseModel<UploadDocumentRequest> {
  @ApiProperty({
    title: 'Document label',
    description: 'The label of the document',
  })
  @IsNotEmpty()
  @IsString()
  @Expose()
  label: string;

  @ApiProperty({
    title: 'Document type',
    description: 'The type of the document',
  })
  @IsEnum(DocumentType)
  @Expose()
  type: DocumentType;

  @ApiProperty({
    title: 'Document filestack url',
    description: 'The filestack url of the document',
  })
  @IsNotEmpty()
  @IsUrl()
  @Expose()
  filestackUrl: string;

  @ApiProperty({
    title: 'Document name',
    description: 'The name of the document',
  })
  @IsNotEmpty()
  @IsString()
  @Expose()
  name: string;
}
