import {
  IsArray,
  IsBoolean,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
  IsObject,
  IsUUID,
  IsDateString,
  IsEnum,
  isDateString,
  IsNotEmpty,
} from 'class-validator';
import { Type, Expose } from 'class-transformer';
import {
  CanonicalBrokerEntity,
  CanonicalCarrierEntity,
  PeruseAddress,
} from '../common';
import { AddressType } from '../../../persistence';

class BrokerName {
  @Expose({ name: 'rate_confirmation_vs_BOL_match_probability' })
  @IsOptional()
  @IsNumber()
  rateConfirmationVsBolMatchProbability: number | null;

  @Expose({ name: 'carrier_invoice_vs_structured_load_data_match_probability' })
  @IsOptional()
  @IsNumber()
  carrierInvoiceVsStructuredLoadDataMatchProbability: number | null;

  @Expose({ name: 'BOL_vs_structured_load_data_match_probability' })
  @IsOptional()
  @IsNumber()
  bolVsStructuredLoadDataMatchProbability: number | null;

  @Expose({ name: 'rate_confirmation_canonical' })
  @IsArray()
  @IsString({ each: true })
  rateConfirmationCanonical: string[];

  @Expose({ name: 'rate_confirmation_raw_all' })
  @IsArray()
  @IsString({ each: true })
  rateConfirmationRawAll: string[];

  @Expose({ name: 'carrier_invoice_vs_BOL_match_probability' })
  @IsOptional()
  @IsNumber()
  carrierInvoiceVsBolMatchProbability: number | null;

  @Expose({ name: 'rate_confirmation_recent_preference' })
  @IsArray()
  @IsString({ each: true })
  rateConfirmationRecentPreference: string[];

  @Expose({ name: 'rate_confirmation_raw' })
  @IsOptional()
  @IsString()
  rateConfirmationRaw: string | null;

  @Expose({ name: 'carrier_invoice_vs_rate_confirmation_match_probability' })
  @IsOptional()
  @IsNumber()
  carrierInvoiceVsRateConfirmationMatchProbability: number | null;

  @Expose({ name: 'carrier_invoice' })
  @IsOptional()
  @IsString()
  carrierInvoice: string | null;

  @Expose({ name: 'structured_load_data' })
  @IsOptional()
  @IsString()
  structuredLoadData: string | null;

  @Expose({ name: 'BOL' })
  @IsOptional()
  @IsString()
  bol: string | null;

  @Expose({ name: 'rate_confirmation' })
  @IsOptional()
  @IsString()
  rateConfirmation: string | null;

  @Expose({
    name: 'rate_confirmation_vs_structured_load_data_match_probability',
  })
  @IsOptional()
  @IsNumber()
  rateConfirmationVsStructuredLoadDataMatchProbability: number | null;
}

class ShipperAddressParsed {
  @Expose({ name: 'shipper_address_address_type' })
  @IsOptional()
  @IsString()
  shipperAddressAddressType: string | null;

  @Expose({ name: 'shipper_address_street' })
  @IsOptional()
  @IsString()
  shipperAddressStreet: string | null;

  @Expose({ name: 'shipper_address_city' })
  @IsOptional()
  @IsString()
  shipperAddressCity: string | null;

  @Expose({ name: 'shipper_address_zip' })
  @IsOptional()
  @IsString()
  shipperAddressZip: string | null;

  @Expose({ name: 'shipper_address_state' })
  @IsOptional()
  @IsString()
  shipperAddressState: string | null;
}

class PickupAddress {
  @Expose({ name: 'rate_confirmation_vs_BOL_match_probability' })
  @IsOptional()
  @IsNumber()
  rateConfirmationVsBolMatchProbability: number | null;

  @Expose({ name: 'rate_confirmation_parsed' })
  @ValidateNested()
  @Type(() => ShipperAddressParsed)
  rateConfirmationParsed: ShipperAddressParsed;

  @Expose({ name: 'structured_load_data_vs_BOL_distance_in_miles' })
  @IsOptional()
  @IsNumber()
  structuredLoadDataVsBolDistanceInMiles: number | null;

  @Expose({
    name: 'structured_load_data_vs_rate_confirmation_distance_in_miles',
  })
  @IsOptional()
  @IsNumber()
  structuredLoadDataVsRateConfirmationDistanceInMiles: number | null;

  @Expose({ name: 'BOL_vs_structured_load_data_match_probability' })
  @IsOptional()
  @IsNumber()
  bolVsStructuredLoadDataMatchProbability: number | null;

  @Expose({ name: 'BOL_parsed' })
  @ValidateNested()
  @Type(() => ShipperAddressParsed)
  bolParsed: ShipperAddressParsed;

  @Expose({ name: 'rate_confirmation_vs_BOL_distance_in_miles' })
  @IsOptional()
  @IsNumber()
  rateConfirmationVsBolDistanceInMiles: number | null;

  @Expose({ name: 'structured_load_data' })
  @IsOptional()
  @IsString()
  structuredLoadData: string | null;

  @Expose({ name: 'BOL' })
  @IsString()
  bol: string;

  @Expose({ name: 'rate_confirmation' })
  @IsString()
  rateConfirmation: string;

  @Expose({
    name: 'rate_confirmation_vs_structured_load_data_match_probability',
  })
  @IsOptional()
  @IsNumber()
  rateConfirmationVsStructuredLoadDataMatchProbability: number | null;
}

class DeliveryAddressParsed {
  @Expose({ name: 'receiver_address_address_type' })
  @IsOptional()
  @IsString()
  receiverAddressAddressType: string | null;

  @Expose({ name: 'receiver_address_street' })
  @IsOptional()
  @IsString()
  receiverAddressStreet: string | null;

  @Expose({ name: 'receiver_address_city' })
  @IsOptional()
  @IsString()
  receiverAddressCity: string | null;

  @Expose({ name: 'receiver_address_zip' })
  @IsOptional()
  @IsString()
  receiverAddressZip: string | null;

  @Expose({ name: 'receiver_address_state' })
  @IsOptional()
  @IsString()
  receiverAddressState: string | null;
}

class DeliveryAddress {
  @Expose({ name: 'rate_confirmation_vs_BOL_match_probability' })
  @IsOptional()
  @IsNumber()
  rateConfirmationVsBolMatchProbability: number | null;

  @Expose({ name: 'rate_confirmation_parsed' })
  @ValidateNested()
  @Type(() => DeliveryAddressParsed)
  rateConfirmationParsed: DeliveryAddressParsed;

  @Expose({ name: 'structured_load_data_vs_BOL_distance_in_miles' })
  @IsOptional()
  @IsNumber()
  structuredLoadDataVsBolDistanceInMiles: number | null;

  @Expose({
    name: 'structured_load_data_vs_rate_confirmation_distance_in_miles',
  })
  @IsOptional()
  @IsNumber()
  structuredLoadDataVsRateConfirmationDistanceInMiles: number | null;

  @Expose({ name: 'BOL_vs_structured_load_data_match_probability' })
  @IsOptional()
  @IsNumber()
  bolVsStructuredLoadDataMatchProbability: number | null;

  @Expose({ name: 'BOL_parsed' })
  @ValidateNested()
  @Type(() => DeliveryAddressParsed)
  bolParsed: DeliveryAddressParsed;

  @Expose({ name: 'rate_confirmation_vs_BOL_distance_in_miles' })
  @IsOptional()
  @IsNumber()
  rateConfirmationVsBolDistanceInMiles: number | null;

  @Expose({ name: 'structured_load_data' })
  @IsOptional()
  @IsString()
  structuredLoadData: string | null;

  @Expose({ name: 'BOL' })
  @IsString()
  bol: string;

  @Expose({ name: 'rate_confirmation' })
  @IsString()
  rateConfirmation: string;

  @Expose({
    name: 'rate_confirmation_vs_structured_load_data_match_probability',
  })
  @IsOptional()
  @IsNumber()
  rateConfirmationVsStructuredLoadDataMatchProbability: number | null;
}

class BrokerAddressParsed {
  @Expose({ name: 'broker_address_address_type' })
  @IsOptional()
  @IsString()
  brokerAddressAddressType: string | null;

  @Expose({ name: 'broker_address_street' })
  @IsOptional()
  @IsString()
  brokerAddressStreet: string | null;

  @Expose({ name: 'broker_address_city' })
  @IsOptional()
  @IsString()
  brokerAddressCity: string | null;

  @Expose({ name: 'broker_address_zip' })
  @IsOptional()
  @IsString()
  brokerAddressZip: string | null;

  @Expose({ name: 'broker_address_state' })
  @IsOptional()
  @IsString()
  brokerAddressState: string | null;
}

class BrokerAddress {
  @Expose({ name: 'rate_confirmation' })
  @IsString()
  rateConfirmation: string;

  @Expose({ name: 'rate_confirmation_parsed' })
  @ValidateNested()
  @Type(() => BrokerAddressParsed)
  rateConfirmationParsed: BrokerAddressParsed;

  @Expose({ name: 'BOL' })
  @IsString()
  bol: string;

  @Expose({ name: 'BOL_parsed' })
  @ValidateNested()
  @Type(() => BrokerAddressParsed)
  bolParsed: BrokerAddressParsed;

  @Expose({ name: 'match_probability' })
  @IsOptional()
  @IsNumber()
  matchProbability: number | null;
}

class Equipment {
  @Expose({ name: 'rate_confirmation' })
  @IsString()
  rateConfirmation: string;

  @Expose({ name: 'BOL' })
  @IsString()
  bol: string;

  @Expose({ name: 'match_probability' })
  @IsOptional()
  @IsNumber()
  matchProbability: number | null;
}

class InvoiceNumber {
  @Expose({ name: 'carrier_invoice' })
  @IsOptional()
  @IsString()
  carrierInvoice: string | null;
}

class Tonu {
  @Expose({ name: 'carrier_invoice' })
  @IsBoolean()
  carrierInvoice: boolean;

  @Expose({ name: 'rate_confirmation' })
  @IsBoolean()
  rateConfirmation: boolean;
}

class Commodity {
  @Expose({ name: 'rate_confirmation' })
  @IsString()
  rateConfirmation: string;

  @Expose({ name: 'BOL' })
  @IsString()
  bol: string;

  @Expose({ name: 'match_probability' })
  @IsOptional()
  @IsNumber()
  matchProbability: number | null;
}

class CarrierName {
  @Expose({ name: 'rate_confirmation_vs_BOL_match_probability' })
  @IsOptional()
  @IsNumber()
  rateConfirmationVsBolMatchProbability: number | null;

  @Expose({ name: 'carrier_invoice_vs_structured_load_data_match_probability' })
  @IsOptional()
  @IsNumber()
  carrierInvoiceVsStructuredLoadDataMatchProbability: number | null;

  @Expose({ name: 'BOL_vs_structured_load_data_match_probability' })
  @IsOptional()
  @IsNumber()
  bolVsStructuredLoadDataMatchProbability: number | null;

  @Expose({ name: 'rate_confirmation_canonical' })
  @IsArray()
  @IsString({ each: true })
  rateConfirmationCanonical: string[];

  @Expose({ name: 'rate_confirmation_raw_all' })
  @IsArray()
  @IsString({ each: true })
  rateConfirmationRawAll: string[];

  @Expose({ name: 'carrier_invoice_vs_BOL_match_probability' })
  @IsOptional()
  @IsNumber()
  carrierInvoiceVsBolMatchProbability: number | null;

  @Expose({ name: 'rate_confirmation_recent_preference' })
  @IsArray()
  @IsString({ each: true })
  rateConfirmationRecentPreference: string[];

  @Expose({ name: 'rate_confirmation_raw' })
  @IsString()
  rateConfirmationRaw: string;

  @Expose({ name: 'carrier_invoice_vs_rate_confirmation_match_probability' })
  @IsOptional()
  @IsNumber()
  carrierInvoiceVsRateConfirmationMatchProbability: number | null;

  @Expose({ name: 'carrier_invoice' })
  @IsOptional()
  @IsString()
  carrierInvoice: string | null;

  @Expose({ name: 'structured_load_data' })
  @IsOptional()
  @IsString()
  structuredLoadData: string | null;

  @Expose({ name: 'BOL' })
  @IsOptional()
  @IsString()
  bol: string | null;

  @Expose({ name: 'rate_confirmation' })
  @IsString()
  rateConfirmation: string;

  @Expose({
    name: 'rate_confirmation_vs_structured_load_data_match_probability',
  })
  @IsOptional()
  @IsNumber()
  rateConfirmationVsStructuredLoadDataMatchProbability: number | null;
}

class BOLPages {
  @Expose({ name: 'present' })
  @IsNumber()
  present: number;

  @Expose({ name: 'expected' })
  @IsArray()
  @IsString({ each: true })
  expected: string[];

  @Expose({ name: 'missing' })
  @IsArray()
  @IsString({ each: true })
  missing: string[];
}

class Rate {
  @Expose({ name: 'rate_confirmation_lumper_rate' })
  @IsOptional()
  @IsNumber()
  rateConfirmationLumperRate: number | null;

  @Expose({ name: 'carrier_invoice_vs_structured_load_data_match_probability' })
  @IsOptional()
  @IsNumber()
  carrierInvoiceVsStructuredLoadDataMatchProbability: number | null;

  @Expose({ name: 'rate_confirmation_other_accessorial_charges' })
  @IsOptional()
  @IsNumber()
  rateConfirmationOtherAccessorialCharges: number | null;

  @Expose({ name: 'rate_confirmation_total_rate' })
  @IsNumber()
  rateConfirmationTotalRate: number;

  @Expose({ name: 'rate_confirmation_line_haul_rate' })
  @IsOptional()
  @IsNumber()
  rateConfirmationLineHaulRate: number | null;

  @Expose({ name: 'carrier_invoice_vs_rate_confirmation_match_probability' })
  @IsOptional()
  @IsNumber()
  carrierInvoiceVsRateConfirmationMatchProbability: number | null;

  @Expose({ name: 'structured_load_data' })
  @IsOptional()
  @IsString()
  structuredLoadData: string | null;

  @Expose({ name: 'carrier_invoice_total_rate' })
  @IsOptional()
  @IsNumber()
  carrierInvoiceTotalRate: number | null;

  @Expose({
    name: 'rate_confirmation_vs_structured_load_data_match_probability',
  })
  @IsOptional()
  @IsNumber()
  rateConfirmationVsStructuredLoadDataMatchProbability: number | null;
}

class BrokerEmailDomains {
  @Expose({ name: 'rate_confirmation' })
  @IsArray()
  @IsString({ each: true })
  rateConfirmation: string[];

  @Expose({ name: 'rate_confirmation_vs_known_broker_domain_probability' })
  @IsOptional()
  @IsNumber()
  rateConfirmationVsKnownBrokerDomainProbability: number | null;
}

class BrokerReferenceNumber {
  @Expose({ name: 'BOL_reference_number_conformity' })
  @IsOptional()
  @IsNumber()
  bolReferenceNumberConformity: number | null;

  @Expose({ name: 'rate_confirmation_reference_number_conformity' })
  @IsOptional()
  @IsNumber()
  rateConfirmationReferenceNumberConformity: number | null;
}

class BrokerEmail {
  @Expose({ name: 'rate_confirmation' })
  @IsOptional()
  @IsString()
  rateConfirmation: string | null;

  @Expose({ name: 'BOL' })
  @IsOptional()
  @IsString()
  bol: string | null;

  @Expose({ name: 'structured_load_data' })
  @IsOptional()
  @IsString()
  structuredLoadData: string | null;

  @Expose({ name: 'rate_confirmation_vs_BOL_match_probability' })
  @IsOptional()
  @IsNumber()
  rateConfirmationVsBolMatchProbability: number | null;

  @Expose({ name: 'BOL_vs_structured_load_data_match_probability' })
  @IsOptional()
  @IsNumber()
  bolVsStructuredLoadDataMatchProbability: number | null;

  @Expose({
    name: 'rate_confirmation_vs_structured_load_data_match_probability',
  })
  @IsOptional()
  @IsNumber()
  rateConfirmationVsStructuredLoadDataMatchProbability: number | null;
}

class PickupDate {
  @Expose({ name: 'rate_confirmation_date' })
  @IsDateString()
  rateConfirmationDate: string;

  @Expose({ name: 'BOL_date' })
  @IsDateString()
  bolDate: string;

  @Expose({ name: 'match_probability' })
  @IsOptional()
  @IsNumber()
  matchProbability: number | null;
}

class DeliveryDate {
  @Expose({ name: 'rate_confirmation_date' })
  @IsDateString()
  rateConfirmationDate: string;

  @Expose({ name: 'BOL_date' })
  @IsDateString()
  bolDate: string;

  @Expose({ name: 'match_probability' })
  @IsOptional()
  @IsNumber()
  matchProbability: number | null;
}

class Temperature {
  @Expose({ name: 'rate_confirmation' })
  @IsString()
  rateConfirmation: string;

  @Expose({ name: 'BOL' })
  @IsString()
  bol: string;

  @Expose({ name: 'match_probability' })
  @IsOptional()
  @IsNumber()
  matchProbability: number | null;
}

class TotalProductWeight {
  @Expose({ name: 'rate_confirmation_weight' })
  @IsNumber()
  rateConfirmationWeight: number;

  @Expose({ name: 'BOL_weight' })
  @IsNumber()
  bolWeight: number;

  @Expose({ name: 'match_probability' })
  @IsOptional()
  @IsNumber()
  matchProbability: number | null;
}

class POReferenceNumber {
  @Expose({ name: 'rate_confirmation' })
  @IsString()
  rateConfirmation: string;

  @Expose({ name: 'BOL' })
  @IsString()
  bol: string;

  @Expose({ name: 'match_probability' })
  @IsOptional()
  @IsNumber()
  matchProbability: number | null;
}

export class Fields {
  @ValidateNested()
  @Expose({ name: 'delivery_address' })
  @Type(() => DeliveryAddress)
  deliveryAddress: DeliveryAddress;

  @ValidateNested()
  @Expose({ name: 'pickup_address' })
  @Type(() => PickupAddress)
  pickupAddress: PickupAddress;

  @ValidateNested()
  @Type(() => BrokerAddress)
  brokerAddress: BrokerAddress;

  @Expose({ name: 'BOL' })
  @IsOptional()
  @IsString()
  bol: string | null;

  @Expose({ name: 'rate_confirmation' })
  @IsString()
  rateConfirmation: string;

  @Expose({ name: 'carrier_invoice' })
  @IsOptional()
  @IsString()
  carrierInvoice: string | null;

  @Expose({ name: 'match_probability' })
  @IsOptional()
  @IsNumber()
  matchProbability: number | null;

  @ValidateNested()
  @Type(() => Equipment)
  equipment: Equipment;

  @ValidateNested()
  @Type(() => InvoiceNumber)
  invoiceNumber: InvoiceNumber;

  @ValidateNested()
  @Type(() => Tonu)
  tonu: Tonu;

  @ValidateNested()
  @Type(() => Commodity)
  commodity: Commodity;

  @ValidateNested()
  @Type(() => CarrierName)
  carrierName: CarrierName;

  @ValidateNested()
  @Type(() => BOLPages)
  bolPages: BOLPages;

  @ValidateNested()
  @Type(() => Rate)
  rate: Rate;

  @ValidateNested()
  @Type(() => BrokerEmailDomains)
  brokerEmailDomains: BrokerEmailDomains;

  @ValidateNested()
  @Type(() => BrokerReferenceNumber)
  brokerReferenceNumber: BrokerReferenceNumber;

  @Expose({ name: 'broker_email' })
  @ValidateNested()
  @Type(() => BrokerEmail)
  brokerEmail: BrokerEmail;

  @Expose({ name: 'pickup_date' })
  @ValidateNested()
  @Type(() => PickupDate)
  pickupDate: PickupDate;

  @Expose({ name: 'delivery_date' })
  @ValidateNested()
  @Type(() => DeliveryDate)
  deliveryDate: DeliveryDate;

  @Expose({ name: 'broker_name' })
  @ValidateNested()
  @Type(() => DeliveryDate)
  brokerName: BrokerName;

  @ValidateNested()
  @Type(() => Temperature)
  temperature: Temperature;

  @ValidateNested()
  @Type(() => TotalProductWeight)
  totalProductWeight: TotalProductWeight;

  @ValidateNested()
  @Type(() => POReferenceNumber)
  poReferenceNumber: POReferenceNumber;
}

enum JobStatus {
  SUCCESS = 'success',
  FAILURE = 'failure',
}

class Message {
  @IsUUID()
  id: string;
}

class StructuredLoadData {
  @IsUUID()
  external_id: string;
}

class Document {
  @IsUUID()
  @IsNotEmpty()
  external_id: string;

  @IsString()
  @IsNotEmpty()
  document_ref: string;
}

class Input {
  @ValidateNested()
  @Type(() => Message)
  message: Message;

  @ValidateNested()
  @Type(() => StructuredLoadData)
  structured_load_data: StructuredLoadData;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => Document)
  documents: Document[];
}

class Checks {
  @Expose({ name: 'damages_or_shortages_probability' })
  @IsOptional()
  @IsNumber()
  damagesOrShortagesProbability: number | null;

  @Expose({ name: 'produce_probability' })
  @IsNumber()
  produceProbability: number;

  @Expose({ name: 'multistop_probability' })
  @IsNumber()
  multistopProbability: number;

  @Expose({ name: 'signature_present_probability' })
  @IsOptional()
  @IsNumber()
  signaturePresentProbability: number | null;

  @Expose({ name: 'late_delivery_probability' })
  @IsNumber()
  lateDeliveryProbability: number;

  @Expose({ name: 'bol_pages_missing_probability' })
  @IsNumber()
  bolPagesMissingProbability: number;

  @Expose({ name: 'receiver_stamp_present' })
  @IsBoolean()
  receiverStampPresent: boolean;

  @Expose({ name: 'is_tonu' })
  @IsBoolean()
  isTonu: boolean;
}

export class VerifyLoadResponse {
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
  bolVsRateConfirmationProbability: number;

  @Expose({ name: 'structured_load_data_vs_rate_confirmation_probability' })
  @IsNumber()
  structuredLoadDataVsRateConfirmationProbability: number;

  @Expose({ name: 'carrier_invoice_vs_rate_confirmation_probability' })
  @IsNumber()
  carrierInvoiceVsRateConfirmationProbability: number;

  @ValidateNested()
  @Type(() => Checks)
  checks: Checks;

  @Expose({ name: 'potential_duplicate_loads' })
  @IsArray()
  @IsUUID('4', { each: true })
  potentialDuplicateLoads: string[];

  @Expose({ name: 'funding_methods' })
  @IsArray()
  fundingMethods: any[];

  @ValidateNested()
  @Type(() => Fields)
  fields: Fields;
}

class Result {
  @Expose({ name: 'verify_load_response' })
  @ValidateNested()
  @Type(() => VerifyLoadResponse)
  verifyLoadResponse: VerifyLoadResponse;

  @Expose({ name: 'status' })
  @IsEnum(JobStatus)
  status: JobStatus;

  @Expose({ name: 'message' })
  @IsString()
  message: string;

  @Expose({ name: 'debtor_system_verification' })
  @IsObject()
  @IsOptional()
  debtorSystemVerification: {
    message: string;
    error: string;
  };
}
export class PeruseCreateLoadJobResult {
  @IsUUID()
  @Expose({ name: 'job_id' })
  jobId: string;

  @Expose({ name: 'job_type' })
  @IsString()
  jobType: string;

  @Expose({ name: 'status' })
  @IsEnum(JobStatus)
  status: JobStatus;

  @Expose({ name: 'input' })
  @ValidateNested()
  @Type(() => Input)
  input: Input;

  @Expose({ name: 'result' })
  @ValidateNested()
  @Type(() => Result)
  result: Result;

  @Expose({ name: 'message' })
  @IsString()
  message: string;

  @IsUUID()
  @Expose({ name: 'load_id' })
  loadId: string;

  @Expose({ name: 'document_ids' })
  @IsArray()
  @IsUUID('4', { each: true })
  documentIds: string[];

  getJobId() {
    return this.jobId;
  }

  getLoadId() {
    return this.loadId;
  }

  getResult() {
    return this.result;
  }

  getExternalIds() {
    return this.input.documents.map((doc) => doc.external_id);
  }

  getBrokerNames() {
    return (
      this.result.verifyLoadResponse.fields.brokerName.rateConfirmationRawAll ||
      []
    );
  }

  getPickupAddress() {
    const model = new PeruseAddress();
    model.type = AddressType.Pickup;

    const rateConfirmationAddress =
      this.result.verifyLoadResponse.fields.pickupAddress.rateConfirmation;
    const bolAddress = this.result.verifyLoadResponse.fields.pickupAddress.bol;

    if (!rateConfirmationAddress && !bolAddress) {
      return model;
    }

    if (rateConfirmationAddress) {
      const structuredData =
        this.result.verifyLoadResponse.fields.pickupAddress
          .rateConfirmationParsed;
      model.city = structuredData.shipperAddressCity || '';
      model.state = structuredData.shipperAddressState || '';
      model.fullAddress = rateConfirmationAddress || '';
      const pickupDate =
        this.result.verifyLoadResponse.fields.pickupDate.rateConfirmationDate;
      if (pickupDate && isDateString(pickupDate)) {
        model.date = new Date(pickupDate);
      }
    } else if (bolAddress) {
      const structuredData =
        this.result.verifyLoadResponse.fields.pickupAddress.bolParsed;
      model.city = structuredData.shipperAddressCity || '';
      model.state = structuredData.shipperAddressState || '';
      model.fullAddress = bolAddress || '';
      const pickupDate =
        this.result.verifyLoadResponse.fields.pickupDate.bolDate;
      if (pickupDate && isDateString(pickupDate)) {
        model.date = new Date(pickupDate);
      }
    }
    return model;
  }

  getDeliveryAddress() {
    const model = new PeruseAddress();
    model.type = AddressType.Delivery;

    const rateConfirmationAddress =
      this.result.verifyLoadResponse.fields.deliveryAddress.rateConfirmation;
    const bolAddress =
      this.result.verifyLoadResponse.fields.deliveryAddress.bol;

    if (!rateConfirmationAddress && !bolAddress) {
      return model;
    }

    if (rateConfirmationAddress) {
      const structuredData =
        this.result.verifyLoadResponse.fields.deliveryAddress
          .rateConfirmationParsed;
      model.city = structuredData.receiverAddressCity || '';
      model.state = structuredData.receiverAddressState || '';
      model.fullAddress = rateConfirmationAddress || '';
      const deliveryDate =
        this.result.verifyLoadResponse.fields.deliveryDate.rateConfirmationDate;
      if (deliveryDate && isDateString(deliveryDate)) {
        model.date = new Date(deliveryDate);
      }
    } else if (bolAddress) {
      const structuredData =
        this.result.verifyLoadResponse.fields.deliveryAddress.bolParsed;
      model.city = structuredData.receiverAddressCity || '';
      model.state = structuredData.receiverAddressCity || '';
      model.fullAddress = bolAddress || '';
      const deliveryDate =
        this.result.verifyLoadResponse.fields.deliveryDate.bolDate;
      if (deliveryDate && isDateString(deliveryDate)) {
        model.date = new Date(deliveryDate);
      }
    }
    return model;
  }
}
