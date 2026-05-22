import { BaseModel } from '@core/data';
import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsUUID } from 'class-validator';

export class FactorLoadRequest extends BaseModel<FactorLoadRequest> {
  @Expose()
  @IsUUID()
  @ApiProperty({
    title: 'Invoice ID',
    description: 'The invoice ID of the factored load',
  })
  invoiceId: string;
}
