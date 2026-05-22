import { v4 as uuidv4 } from 'uuid';
import {
  Broker,
  BrokerAddress,
  BrokerAddressType,
  BrokerContact,
  BrokerEmail,
  BrokerEmailType,
  BrokerRating,
  BrokerRole,
  BrokerStatus,
} from '../data/model';

export const buildStubBroker = (data?: Partial<Broker>): Broker => {
  const broker = new Broker({
    id: uuidv4(),
    legalName: 'Acme LLC',
    phone: '(760) 241-2277',
    rating: BrokerRating.A,
    externalRating: BrokerRating.A,
    createdAt: new Date(),
    updatedAt: new Date(),
    status: BrokerStatus.Active,
  });
  broker.addresses = [
    new BrokerAddress({
      id: uuidv4(),
      address: '14689 Valley Center Dr',
      streetAddress: '14689 Valley Center Dr',
      city: 'Victorville',
      state: 'California',
      zip: '92395',
      type: BrokerAddressType.Office,
    }),
  ];
  broker.emails = [
    new BrokerEmail({
      id: uuidv4(),
      email: 'test@bobtail.com',
      type: BrokerEmailType.NOA,
    }),
    new BrokerEmail({
      id: uuidv4(),
      email: 'test@bobtail.com',
      type: BrokerEmailType.PaymentStatus,
    }),
    new BrokerEmail({
      id: uuidv4(),
      email: 'test@bobtail.com',
      type: BrokerEmailType.InvoiceDelivery,
    }),
  ];
  broker.contacts = [
    new BrokerContact({
      id: '76473e45-8499-4801-bb24-9c01bcd11e6b',
      name: 'John Smith',
      countryPhoneCode: 'US',
      phone: '765-461-9920 x321',
      email: 'john@smith.com',
      role: BrokerRole.Other,
      isPrimary: true,
    }),
  ];

  Object.assign(broker, data);
  return broker;
};
