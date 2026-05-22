import Big from 'big.js';
import { Expose, Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  ValidateNested,
} from 'class-validator';
import { CanonicalBrokerEntity, CanonicalCarrierEntity } from '../common';

class Fields {
  @Expose({ name: 'delivery_address' })
  @IsString()
  @IsOptional()
  deliveryAddress: string;

  @Expose({ name: 'broker_address' })
  @IsString()
  @IsOptional()
  brokerAddress: string;

  @Expose({ name: 'delivery_date' })
  @IsDateString()
  @IsNotEmpty()
  deliveryDate: string;

  @Expose({ name: 'remit_to_address' })
  @IsString()
  @IsOptional()
  remitToAddress: string | null;

  @IsString()
  @IsNotEmpty()
  equipment: string;

  @Expose({ name: 'invoice_number' })
  @IsString()
  @IsOptional()
  invoiceNumber: string | null;

  @IsBoolean()
  @IsNotEmpty()
  tonu: boolean;

  @IsString()
  @IsNotEmpty()
  commodity: string;

  @Expose({ name: 'carrier_name' })
  @IsString()
  @IsNotEmpty()
  carrierName: string;

  @Expose({ name: 'BOL_pages' })
  @IsString()
  @IsOptional()
  bolPages: string | null;

  @Expose({ name: 'pickup_date' })
  @IsDateString()
  @IsNotEmpty()
  pickupDate: string;

  @IsNumber()
  @IsNotEmpty()
  rate: number;

  @Expose({ name: 'broker_email_domains' })
  @IsArray()
  @IsString({ each: true })
  @IsNotEmpty()
  brokerEmailDomains: string[];

  @Expose({ name: 'load_number' })
  @IsString()
  @IsNotEmpty()
  loadNumber: string;

  @Expose({ name: 'carrier_mc' })
  @IsString()
  @IsOptional()
  carrierMc: string | null;

  @Expose({ name: 'broker_name' })
  @IsString()
  @IsOptional()
  brokerName: string | null;

  @Expose({ name: 'broker_mc' })
  @IsString()
  @IsOptional()
  brokerMc: string | null;

  @Expose({ name: 'broker_dot' })
  @IsString()
  @IsOptional()
  brokerDot: string | null;

  @Expose({ name: 'carrier_root_canonical_entity_id' })
  @IsString()
  @IsOptional()
  carrierRootCanonicalEntityId: string | null;

  @Expose({ name: 'pickup_address' })
  @IsString()
  @IsNotEmpty()
  pickupAddress: string;

  @Expose({ name: 'broker_root_canonical_entity_id' })
  @IsString()
  @IsOptional()
  brokerRootCanonicalEntityId: string | null;

  @Expose({ name: 'carrier_dot' })
  @IsString()
  @IsOptional()
  carrierDot: string | null;

  @Expose({ name: 'shipper_reference_number' })
  @IsString()
  @IsNotEmpty()
  shipperReferenceNumber: string;

  @IsString()
  @IsOptional()
  temperature: string;

  @Expose({ name: 'broker_email' })
  @IsString()
  brokerEmail: null | string;

  @Expose({ name: 'total_product_weight' })
  @IsString()
  @IsNotEmpty()
  totalProductWeight: string;

  @Expose({ name: 'remit_to_name' })
  @IsString()
  @IsOptional()
  remitToName: string | null;

  @Expose({ name: 'broker_reference_number' })
  @IsString()
  @IsNotEmpty()
  brokerReferenceNumber: string;
}

class Checks {
  @Expose({ name: 'damages_or_shortages_probability' })
  @IsNumber()
  @IsOptional()
  damagesOrShortagesProbability: number | null;

  @Expose({ name: 'produce_probability' })
  @IsNumber()
  @IsNotEmpty()
  produceProbability: number;

  @Expose({ name: 'multistop_probability' })
  @IsNumber()
  @IsNotEmpty()
  multistopProbability: number;

  @Expose({ name: 'signature_present_probability' })
  @IsNumber()
  @IsOptional()
  signaturePresentProbability: number | null;

  @Expose({ name: 'late_delivery_probability' })
  @IsNumber()
  @IsNotEmpty()
  lateDeliveryProbability: number;

  @Expose({ name: 'bol_pages_missing_probability' })
  @IsNumber()
  @IsNotEmpty()
  bolPagesMissingProbability: number;

  @Expose({ name: 'receiver_stamp_present' })
  @IsBoolean()
  @IsNotEmpty()
  receiverStampPresent: boolean;

  @Expose({ name: 'is_tonu' })
  @IsBoolean()
  @IsNotEmpty()
  isTonu: boolean;
}

class EntityData {
  @Expose({ name: 'canonical_broker_entity' })
  @ValidateNested()
  @Type(() => CanonicalBrokerEntity)
  canonicalBrokerEntity?: CanonicalBrokerEntity;

  @Expose({ name: 'canonical_carrier_entity' })
  @ValidateNested()
  @Type(() => CanonicalCarrierEntity)
  canonicalCarrierEntity?: CanonicalCarrierEntity;

  @Expose({ name: 'BOL_vs_rate_confirmation_probability' })
  @IsNumber()
  @IsNotEmpty()
  bolVsRateConfirmationProbability: number;

  @Expose({ name: 'potential_duplicate_loads' })
  @IsArray()
  @IsUUID('4', { each: true })
  @IsNotEmpty()
  potentialDuplicateLoads: string[];

  @Expose({ name: 'factorsoft_note_xml_url' })
  @IsString()
  @IsOptional()
  factorsoftNoteXmlUrl: string | null;

  @ValidateNested()
  @Type(() => Fields)
  fields: Fields;

  @ValidateNested()
  @Type(() => Checks)
  checks: Checks;

  @Expose({ name: 'structured_load_data_vs_rate_confirmation_probability' })
  @IsNumber()
  @IsNotEmpty()
  structuredLoadDataVsRateConfirmationProbability: number;

  @Expose({ name: 'carrier_invoice_vs_rate_confirmation_probability' })
  @IsNumber()
  @IsNotEmpty()
  carrierInvoiceVsRateConfirmationProbability: number;

  @Expose({ name: 'factorsoft_xml_url' })
  @IsString()
  @IsOptional()
  factorsoftXmlUrl: string | null;

  @Expose({ name: 'funding_methods' })
  @IsArray()
  @IsOptional()
  fundingMethods: any[];
}

class AuditLog {
  @IsString()
  @IsOptional()
  user: string | null;

  @IsString()
  @IsNotEmpty()
  operation: string;

  @Expose({ name: 'changed_at' })
  @IsDateString()
  @IsNotEmpty()
  changedAt: string;
}

export class PeruseLoadResponse {
  @Expose({ name: 'entity_type' })
  @IsString()
  @IsNotEmpty()
  entityType: string;

  @Expose({ name: 'entity_data' })
  @ValidateNested()
  @Type(() => EntityData)
  entityData: EntityData;

  @IsString()
  @IsNotEmpty()
  note: string;

  @IsString()
  @IsNotEmpty()
  status: string;

  @Expose({ name: 'document_ids' })
  @IsArray()
  @IsUUID('4', { each: true })
  @IsNotEmpty()
  documentIds: string[];

  @Expose({ name: 'task_id' })
  @IsString()
  @IsNotEmpty()
  taskId: string;

  @Expose({ name: 'document_urls' })
  @IsArray()
  @IsNotEmpty()
  documentUrls: string[];

  @Type(() => AuditLog)
  auditLog: AuditLog[];

  @Expose({ name: 'load_path' })
  @IsString()
  @IsNotEmpty()
  loadPath: string;

  @Expose({ name: 'entity_id' })
  @IsString()
  @IsUUID()
  @IsNotEmpty()
  entityId: string;

  @Expose({ name: 'job_id' })
  @IsString()
  @IsUUID()
  @IsNotEmpty()
  jobId: string;

  getBrokerCanonicalExternalId(): string {
    return this.entityData.canonicalBrokerEntity?.externalId || '';
  }

  getBrokerName(): string {
    return this.entityData.fields.brokerName || '';
  }

  getBrokerAddress(): string {
    return this.entityData.fields.brokerAddress || '';
  }

  getBrokerMC(): string {
    return this.entityData.fields.brokerMc || '';
  }

  getBrokerDOT(): string {
    return this.entityData.fields.brokerDot || '';
  }

  getBrokerReferenceNumber(): string {
    return this.entityData.fields.brokerReferenceNumber || '';
  }

  getBrokerEmail(): string {
    const email = this.entityData.fields.brokerEmail || '';
    return email.split(';')[0];
  }

  getTotalAmount(): Big {
    return new Big(this.entityData.fields.rate || 0);
  }
}
