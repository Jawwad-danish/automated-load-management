import { BaseModel } from '@core/data';
import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class PlaidAccount extends BaseModel<PlaidAccount> {
  @Expose()
  @ApiProperty({
    required: false,
  })
  id: string;

  @Expose()
  @ApiProperty()
  accountId: string;

  @Expose()
  @ApiProperty()
  accessToken: string;

  @Expose()
  @ApiProperty()
  publicToken: string;

  @Expose()
  @ApiProperty()
  linkSessionId: string;

  @Expose()
  @ApiProperty()
  itemId: string;

  @Expose()
  @ApiProperty()
  bankName: string;

  @Expose()
  @ApiProperty()
  bankAccountName: string;

  @Expose()
  @ApiProperty()
  bankAccountOfficialName: string;

  @Expose()
  @ApiProperty()
  bankAccountOwnerName: string;

  @Expose()
  @ApiProperty()
  verificationStatus: string;
}
