import { BaseModel } from '@core/data';
import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsOptional, IsPhoneNumber, IsString } from 'class-validator';

export class UpdateDriverRequest extends BaseModel<UpdateDriverRequest> {
  @IsOptional()
  @Expose()
  @IsString()
  @ApiProperty({
    title: 'Driver Name',
    description: "The driver's name",
  })
  name?: string;

  @IsOptional()
  @Expose()
  @IsString()
  @IsPhoneNumber()
  @ApiProperty({
    title: 'Driver Phone Number',
    description: "The driver's phone number",
  })
  phoneNumber?: string;
}
