import { AuditBaseModel } from '@core/data';
import { DocumentRequestStatus } from '@module-persistence';
import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsUUID } from 'class-validator';

export class DocumentRequest extends AuditBaseModel<DocumentRequest> {
  @Expose()
  @ApiProperty({
    title: 'Document Request ID',
    description: 'The ID of the document request',
  })
  id: string;

  @Expose()
  @IsUUID()
  @ApiProperty({
    title: 'Driver ID',
    description: 'The ID of the driver',
  })
  driverId: string;

  @Expose()
  @ApiProperty({
    title: 'Driver name',
    description: 'The name of the driver',
  })
  driverName: string;

  @Expose()
  @ApiProperty({
    title: 'Driver phone number',
    description: 'The phone number of the driver',
  })
  driverPhoneNumber: string;

  @Expose()
  @ApiProperty({
    title: 'Scan link url',
    description: 'The url of the scan link',
  })
  url: string;

  @Expose()
  @ApiProperty({
    title: 'Document request status',
    description: 'Status of the document request',
  })
  status: DocumentRequestStatus;
}
