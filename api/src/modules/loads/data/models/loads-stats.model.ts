import { BaseModel } from '@core/data';
import { Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class LoadsStats extends BaseModel<LoadsStats> {
  @Expose()
  @ApiProperty({
    title: 'Factored loads',
    description: 'Factored loads number',
  })
  factoredLoadsCount: number;

  @Expose()
  @ApiProperty({
    title: 'Document received loads',
    description: 'Document received loads number',
  })
  docReceivedLoadsCount: number;

  @Expose()
  @ApiProperty({
    title: 'Document requested loads',
    description: 'Document requested loads number',
  })
  docRequestedLoadsCount: number;

  @Expose()
  @ApiProperty({
    title: 'No documents loads',
    description: 'Loads with no documents number',
  })
  noDocsLoadsCount: number;
}
