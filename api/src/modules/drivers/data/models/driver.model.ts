import { BaseModel } from '@core/data';
import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class Driver extends BaseModel<Driver> {
  @Expose()
  @ApiProperty({
    title: 'Driver ID',
    description: "The driver's ID",
  })
  id: string;

  @Expose()
  @ApiProperty({
    title: 'Driver Name',
    description: "The driver's name",
  })
  name: string;

  @Expose()
  @ApiProperty({
    title: 'Driver Phone Number',
    description: "The driver's phone number",
  })
  phoneNumber: string;
}
