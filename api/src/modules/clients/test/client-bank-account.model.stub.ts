import { DeepPartial } from '@core';
import {
  ClientBankAccount,
  ClientBankAccountStatus,
  ProductName,
} from '../data';
import {
  CounterPartyStatus,
  ModernTreasuryAccount,
} from '../data/modern-treasury-account.model';
import { v4 as uuidv4 } from 'uuid';
import { PlaidAccount } from '../data/plaid-account.model';

export const buildStubClientBankAccount = (
  data?: DeepPartial<ClientBankAccount>,
): ClientBankAccount => {
  const model = new ClientBankAccount({
    id: uuidv4(),
    modernTreasuryAccount: new ModernTreasuryAccount({
      id: uuidv4(),
      externalAccountId: uuidv4(),
      status: CounterPartyStatus.VERIFIED,
      confirmedWire: true,
      wireRoutingNumber: '021000021',
      routingNumber: '312000032',
      account: '0000',
    }),
    plaidAccount: new PlaidAccount({
      bankAccountName: 'Chase',
      bankAccountOfficialName: 'Chase',
      bankAccountOwnerName: 'John',
    }),
    products: [{ name: ProductName.Factoring }],
    status: ClientBankAccountStatus.Active,
  });
  Object.assign(model, data);
  return model;
};
