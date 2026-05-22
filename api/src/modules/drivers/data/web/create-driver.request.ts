import { BaseModel } from '@core/data';
import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsNotEmpty, IsPhoneNumber, IsString } from 'class-validator';

export class CreateDriverRequest extends BaseModel<CreateDriverRequest> {
  @Expose()
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    title: 'Driver Name',
    description: "The driver's name",
  })
  name: string;

  @Expose()
  @IsString()
  @IsNotEmpty()
  @IsPhoneNumber()
  @ApiProperty({
    title: 'Driver Phone Number',
    description: "The driver's phone number",
  })
  phoneNumber: string;
}
