import { AuditBaseModel } from '@core/data';
import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { ClientDocument } from './client-document.model';
import { ClientBankAccount } from './client-bank-account.model';
import { ClientContact } from './client-contact.model';

export enum AuthorityState {
  Active = 'Active',
  Inactive = 'Inactive',
}

export enum InsuranceStatus {
  Active = 'Active',
  Inactive = 'Inactive',
}
export class Client extends AuditBaseModel<Client> {
  @Expose()
  @ApiProperty({
    title: 'Client ID',
    description: 'The client ID',
  })
  id: string;

  @Expose()
  @ApiProperty({
    title: 'Client name',
    description: 'The client name',
  })
  name: string;

  @Expose()
  @ApiProperty({
    title: 'Client short name',
    description: 'The client short name',
  })
  shortName: string;

  @Expose()
  @ApiProperty({
    title: 'Client MC',
    description: 'The client MC',
  })
  mc: string;

  @Expose()
  @ApiProperty({
    title: 'Client DOT',
    description: 'The client DOT',
  })
  dot: string;

  @Expose()
  @ApiProperty({
    title: 'Client EIN',
    description: 'The client EIN',
  })
  ein: string;

  @Expose()
  @ApiProperty({
    title: 'Client Email',
    description: 'The client email',
  })
  email: string;

  @Expose()
  @ApiProperty({
    title: 'Client doing business as',
    description: 'The doing business as field',
  })
  doingBusinessAs: string;

  @Expose()
  @ApiProperty({
    title: 'Client account executive phone number',
    description: 'The client account executive phone number',
  })
  accountExecutivePhoneNumber: string;

  @Expose()
  @ApiProperty({
    title: 'Client authority state',
    description: 'The client authority state',
    enum: AuthorityState,
  })
  commonAuthorityStatus: AuthorityState;

  @Expose()
  @ApiProperty({
    title: 'Client insurance status',
    description: 'The client insurance status',
    enum: InsuranceStatus,
  })
  insuranceStatus: InsuranceStatus;

  @Expose()
  @ApiProperty({
    title: 'Client documents',
    description: 'The client documents',
    type: [ClientDocument],
  })
  documents: ClientDocument[];

  @ApiProperty({
    title: 'Bank accounts',
    description: 'The client bank accounts',
  })
  bankAccounts?: ClientBankAccount[];

  @ApiProperty({
    title: 'Client contacts',
    description: 'The client contacts',
  })
  clientContacts?: ClientContact[];

  @ApiProperty({
    title: 'Languages',
    description: 'The client languages',
  })
  languages?: string[];
}
