import { v4 as uuidv4 } from 'uuid';

import {
  AuthorityState,
  Client,
  ClientDocumentType,
  InsuranceStatus,
} from '../data';
import { DeepPartial } from '@core';
import { RecordStatus } from '../../persistence';

export const buildStubClient = (data?: DeepPartial<Client>): Client => {
  return new Client({
    id: data?.id ?? uuidv4(),
    name: 'Acme LLC',
    shortName: 'Acme',
    mc: 'mc1',
    dot: 'dot1',
    ein: 'ein1',
    commonAuthorityStatus: data?.commonAuthorityStatus ?? AuthorityState.Active,
    insuranceStatus: data?.insuranceStatus ?? InsuranceStatus.Active,
    createdAt: new Date(),
    updatedAt: new Date(),
    documents: [
      {
        id: uuidv4(),
        externalUrl: 'https://cdn.filestackcontent.com/lmJKn17Tamm48i2fUMg0',
        internalUrl: 'https://cdn.filestackcontent.com/lmJKn17Tamm48i2fUMg0',
        type: ClientDocumentType.NOTICE_OF_ASSIGNMENT,
        createdAt: new Date(),
        updatedAt: new Date(),
        recordStatus: RecordStatus.Active,
      },
    ],
  });
};
