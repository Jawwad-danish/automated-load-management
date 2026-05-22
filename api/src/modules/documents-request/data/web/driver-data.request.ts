import { BaseModel } from '@core/data';
import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator';

export class DriverDataRequest extends BaseModel<DriverDataRequest> {
  @ApiProperty({
    title: 'Driver id',
    description: 'ID of the driver',
  })
  @IsNotEmpty()
  @IsString()
  @Expose()
  driverId: string;
}
