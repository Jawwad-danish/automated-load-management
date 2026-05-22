import { BaseModel } from '@core/data';
import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import {
  IsBoolean,
  IsObject,
  IsOptional,
  IsString,
  IsUUID,
  ValidateNested,
} from 'class-validator';
import Big from 'big.js';
import { TransformToBig } from '@core';

class Address extends BaseModel<Address> {
  @IsOptional()
  @Expose()
  @IsString()
  @ApiProperty()
  fullAddress: string;

  @IsOptional()
  @Expose()
  @IsString()
  @ApiProperty()
  city: string;

  @IsOptional()
  @Expose()
  @IsString()
  @ApiProperty()
  state: string;
}

export class UpdateLoadRequest extends BaseModel<UpdateLoadRequest> {
  @IsOptional()
  @Expose()
  @IsUUID()
  @ApiProperty({
    title: 'Broker Id',
    description: 'The Broker Id',
  })
  brokerId: string;

  @IsOptional()
  @Expose()
  @IsString()
  @ApiProperty({
    title: 'Broker Name',
    description: 'The Broker Name',
  })
  brokerName: string;

  @IsOptional()
  @Expose()
  @IsString()
  @ApiProperty({
    title: 'Load Number',
    description: 'The Load Number',
  })
  loadNumber: string;

  @IsOptional()
  @Expose()
  @IsObject()
  @TransformToBig()
  @ApiProperty({
    title: 'Total Amount',
    description: 'The Total Amount of the load',
  })
  totalAmount: Big;

  @IsOptional()
  @Expose()
  @IsBoolean()
  @ApiProperty({
    title: 'Read Status',
    description: 'The read status of the load',
  })
  isRead: boolean;

  @IsOptional()
  @Expose()
  @ApiProperty({
    title: 'Pick Up Location',
    description: 'The Pick Up location of the load',
  })
  @ValidateNested()
  @Type(() => Address)
  pickUpLocation: Address;

  @IsOptional()
  @Expose()
  @ApiProperty({
    title: 'Drop Off Location',
    description: 'The Drop Off location of the load',
  })
  @ValidateNested()
  @Type(() => Address)
  dropOffLocation: Address;
}
