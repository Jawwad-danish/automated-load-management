import {
  Cascade,
  Collection,
  Entity,
  Enum,
  LoadStrategy,
  OneToMany,
  OneToOne,
  Property,
  Rel,
} from '@mikro-orm/core';
import Big from 'big.js';
import { BigJsType } from './big.type';

import { AddressEntity } from './address.entity';
import { BasicMutableEntity } from './basic-mutable.entity';
import { DocumentRequestEntity } from './document-request.entity';
import { DocumentEntity } from './document.entity';
import { EmailEntity } from './email.entity';
import { RecordStatus } from './primitive.entity';
import { LoadTagEntity } from './load-tag-assoc.entity';
import { ActivityLogEntity } from './activity-log.entity';

export enum DocumentStatus {
  DocRequested = 'requested',
  DocReceived = 'received',
  Uploaded = 'uploaded',
  None = 'none',
}

export enum FactoredStatus {
  Factored = 'factored',
  None = 'none',
}

@Entity({ tableName: 'loads' })
export class LoadEntity extends BasicMutableEntity {
  @Property({ type: 'uuid' })
  clientId!: string;

  @Property({ type: 'uuid', nullable: true })
  brokerId?: string;

  @Property({ type: 'text', nullable: true })
  brokerName?: string;

  @Property({
    type: 'text',
    nullable: true,
    comment: 'The broker name from our internal service',
  })
  internalBrokerName?: string;

  @Property({ type: 'text', nullable: true })
  brokerEmail?: string;

  @Property({ type: 'text' })
  loadNumber!: string;

  @Property({ type: BigJsType, nullable: false, default: 0 })
  totalAmount: Big = Big(0);

  @Property({ type: 'boolean', nullable: false, default: false })
  isRead: boolean;

  @Enum({
    items: () => DocumentStatus,
    default: DocumentStatus.None,
  })
  documentStatus: DocumentStatus = DocumentStatus.None;

  @Enum({
    items: () => FactoredStatus,
    default: FactoredStatus.None,
  })
  factoredStatus: FactoredStatus = FactoredStatus.None;

  @Property({ type: 'uuid', nullable: true })
  invoiceId?: string;

  @OneToOne(() => EmailEntity, (email) => email.load, {
    owner: true,
  })
  email!: Rel<EmailEntity>;

  @OneToMany(() => DocumentEntity, (doc) => doc.load, {
    eager: false,
    where: {
      recordStatus: RecordStatus.Active,
    },
  })
  documents = new Collection<DocumentEntity>(this);

  @OneToMany(() => DocumentRequestEntity, (doc) => doc.load, {
    eager: false,
    strategy: LoadStrategy.JOINED,
  })
  documentRequests = new Collection<DocumentRequestEntity>(this);

  @OneToMany(() => AddressEntity, (address) => address.load, {
    eager: false,
    strategy: LoadStrategy.JOINED,
  })
  addresses = new Collection<AddressEntity>(this);

  @OneToMany(() => LoadTagEntity, (loadTag) => loadTag.load, {
    cascade: [Cascade.ALL],
    eager: true,
    orphanRemoval: true,
    strategy: LoadStrategy.SELECT_IN,
  })
  tags = new Collection<LoadTagEntity>(this);

  @OneToMany(() => ActivityLogEntity, (activity) => activity.load, {
    cascade: [Cascade.ALL],
    eager: true,
    orphanRemoval: true,
    strategy: LoadStrategy.SELECT_IN,
  })
  activities = new Collection<ActivityLogEntity>(this);
}
