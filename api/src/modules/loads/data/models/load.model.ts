import { TransformFromBig } from '@core';
import { AuditBaseModel } from '@core/data';
import { Document } from '@module-documents/data';
import {
  AddressType,
  DocumentStatus,
  FactoredStatus,
} from '@module-persistence';
import { ApiProperty } from '@nestjs/swagger';
import Big from 'big.js';
import { Expose } from 'class-transformer';
import { DocumentRequest } from 'src/modules/documents-request/data';
import { TagDefinition } from '@module-tag-definitions';
import { ActivityLog } from './activity-log.model';

export class Address extends AuditBaseModel<Address> {
  @Expose()
  @ApiProperty()
  fullAddress: string;

  @Expose()
  @ApiProperty()
  city: string;

  @Expose()
  @ApiProperty()
  state: string;
}

export class Location extends AuditBaseModel<Location> {
  @Expose()
  @ApiProperty()
  address: Address;

  @Expose()
  @ApiProperty()
  type: AddressType;
}

export class Load extends AuditBaseModel<Load> {
  @Expose()
  @ApiProperty({
    title: 'Load ID',
    description: "The load's ID",
  })
  id: string;

  @Expose()
  @ApiProperty({
    title: 'Load Number',
    description: 'The load number',
  })
  loadNumber: string;

  @Expose()
  @ApiProperty({
    title: 'Invoice ID',
    description: 'Invoice id',
  })
  invoiceId: string;

  @Expose()
  @ApiProperty({
    title: 'Read Status',
    description: 'The Read Status of the load',
  })
  isRead: boolean;

  @Expose()
  @ApiProperty({
    title: 'factored status',
    description: 'The factored status',
  })
  factoredStatus: FactoredStatus;

  @Expose()
  @ApiProperty({
    title: 'Document status',
    description: 'Document status',
  })
  documentStatus: DocumentStatus;

  @Expose()
  @ApiProperty({
    title: 'broker email',
    description: 'The email of broker',
  })
  brokerEmail: string;

  @Expose()
  @ApiProperty({
    title: 'broker id',
    description: 'The id of broker',
  })
  brokerId: string;

  @Expose()
  @ApiProperty({
    title: "sender's email",
    description: 'Email of load sender',
  })
  email: string;

  @Expose()
  @ApiProperty({
    title: 'date',
    description: 'date of submission',
  })
  date: Date;

  @Expose()
  @ApiProperty({
    title: 'Broker Name',
    description: 'Name of broker',
  })
  brokerName: string;

  @Expose()
  @ApiProperty({
    title: 'locations',
    description: 'locations',
  })
  locations: Location[];

  @Expose()
  @TransformFromBig()
  @ApiProperty({
    title: 'Load total amount',
    description: "The load's total amount",
  })
  totalAmount: Big;

  @Expose()
  @ApiProperty({
    title: 'Documents attached',
    description: 'all documents attached',
  })
  documents: Document[];

  @Expose()
  @ApiProperty({
    title: 'document Requested',
    description: 'document Requested',
  })
  documentRequested: DocumentRequest[];

  @Expose()
  @ApiProperty({
    title: 'Tags',
    description:
      'The load tags that represent additional information, metadata',
    type: [TagDefinition],
  })
  tags: TagDefinition[];

  @Expose()
  @ApiProperty({
    title: 'Load activity log',
    description: 'The actions that happened on this load. The load story.',
    type: [ActivityLog],
  })
  activities: ActivityLog[];
}

export class DriverLoad extends AuditBaseModel<DriverLoad> {
  @Expose()
  @ApiProperty({
    title: 'Load ID',
    description: "The load's ID",
  })
  id: string;

  @Expose()
  @ApiProperty({
    title: 'Load Number',
    description: 'The load number',
  })
  loadNumber: string;

  @Expose()
  @ApiProperty({
    title: 'Broker Name',
    description: 'Name of broker',
  })
  brokerName: string;

  @Expose()
  @ApiProperty({
    title: 'locations',
    description: 'locations',
  })
  locations: Location[];
}
