import { BaseModel } from '@core/data';
import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { ModernTreasuryAccount } from './modern-treasury-account.model';
import { PlaidAccount } from './plaid-account.model';

export enum ClientBankAccountStatus {
  Active = 'active',
  Archived = 'archived',
  Inactive = 'inactive',
}

export enum ProductName {
  Card = 'CARD',
  Factoring = 'FACTORING',
}

export class Product extends BaseModel<Product> {
  @Expose()
  @ApiProperty({
    required: false,
  })
  id?: string;

  @Expose()
  @ApiProperty({
    enum: ProductName,
    enumName: 'ProductName',
  })
  name: ProductName;
}

export class ClientBankAccount extends BaseModel<ClientBankAccount> {
  @Expose()
  @ApiProperty()
  id: string;

  @Expose()
  @ApiProperty()
  name: string;

  @Expose()
  @ApiProperty({
    enum: ClientBankAccountStatus,
    enumName: 'ClientBankAccountStatus',
  })
  status: ClientBankAccountStatus;

  @Expose()
  @ApiProperty()
  plaidAccount: PlaidAccount;

  @Expose()
  @ApiProperty()
  modernTreasuryAccount: ModernTreasuryAccount;

  @Expose()
  @ApiProperty({
    type: Product,
    isArray: true,
  })
  products?: Product[];
}
