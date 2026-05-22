import { AuditBaseModel } from '@core/data';
import { DocumentType } from '@module-persistence/entities';
import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class Document extends AuditBaseModel<Document> {
  @Expose()
  @ApiProperty()
  id: string;

  @Expose()
  @ApiProperty()
  name: string;

  @Expose()
  @ApiProperty()
  label: string;

  @Expose()
  @ApiProperty()
  driverName: string;

  @Expose()
  @ApiProperty()
  type: DocumentType;

  @Expose()
  @ApiProperty({
    title: 'Document URL',
    description: 'Document URL',
  })
  url: string;
}
