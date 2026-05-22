import { Expose, Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { AddressType } from '@module-persistence';

export class Document {
  @Expose({ name: 'external_id' })
  @IsNotEmpty()
  externalId: string;

  @Expose({ name: 'url' })
  @IsNotEmpty()
  url: string;
}

export class ProcessingConfigOverride {
  @Expose({ name: 'autoSplit' })
  autoSplit: boolean;
}

export class Input {
  @Expose({ name: 'document' })
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => Document)
  document: Document;

  @Expose({ name: 'extract' })
  @IsBoolean()
  extract: boolean;

  @Expose({ name: 'callback_url' })
  @IsNotEmpty()
  callbackUrl: string;

  @Expose({ name: 'processing-config-override' })
  @ValidateNested()
  @Type(() => ProcessingConfigOverride)
  processingConfigOverride: ProcessingConfigOverride;
}

export class PeruseAddress {
  @IsString()
  fullAddress: string = '';

  @IsString()
  city: string = '';

  @IsString()
  state: string = '';

  @IsString()
  type: AddressType;

  @IsOptional()
  @IsString()
  date?: Date;
}

export class CanonicalBrokerEntity {
  @Expose({ name: 'name' })
  @IsString()
  name: string;

  @Expose({ name: 'contact_phone_numbers' })
  @IsArray()
  contactPhoneNumbers: string[];

  @Expose({ name: 'dot_number' })
  @IsNumber()
  dotNumber: number;

  @Expose({ name: 'mc_number' })
  @IsArray()
  @IsNumber({}, { each: true })
  mcNumber: number[];

  @Expose({ name: 'external_id' })
  @IsOptional()
  @IsString()
  externalId?: string | null;

  @Expose({ name: 'contact_emails' })
  @IsArray()
  @IsString({ each: true })
  contactEmails: string[];

  @Expose({ name: 'name_fmcsa' })
  @IsString()
  nameFmcsa: string;

  @Expose({ name: 'tax_id_number' })
  @IsOptional()
  @IsString()
  taxIdNumber?: string | null;

  @Expose({ name: 'domain_names' })
  @IsArray()
  @IsString({ each: true })
  domainNames: string[];
}

export class CanonicalCarrierEntity {
  @Expose({ name: 'name' })
  @IsString()
  name: string;

  @Expose({ name: 'contact_phone_numbers' })
  @IsArray()
  contactPhoneNumbers: string[];

  @Expose({ name: 'dot_number' })
  @IsNumber()
  dotNumber: number;

  @Expose({ name: 'mc_number' })
  @IsArray()
  @IsNumber({}, { each: true })
  mcNumber: number[];

  @Expose({ name: 'external_id' })
  @IsOptional()
  @IsString()
  externalId?: string | null;

  @Expose({ name: 'contact_emails' })
  @IsArray()
  @IsString({ each: true })
  contactEmails: string[];

  @Expose({ name: 'name_fmcsa' })
  @IsString()
  nameFmcsa: string;

  @Expose({ name: 'tax_id_number' })
  @IsOptional()
  @IsString()
  taxIdNumber?: string | null;

  @Expose({ name: 'domain_names' })
  @IsArray()
  @IsString({ each: true })
  domainNames: string[];
}
