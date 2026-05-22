import { Entity, Enum, Index, ManyToOne, Property, Rel } from '@mikro-orm/core';
import { BasicMutableEntity } from './basic-mutable.entity';
import { LoadEntity } from './load.entity';

export enum DocumentRequestStatus {
  Sent = 'sent',
  Received = 'received',
  Expired = 'expired',
  Failed = 'failed',
}

@Entity({ tableName: 'document_requests' })
export class DocumentRequestEntity extends BasicMutableEntity {
  @Enum({
    items: () => DocumentRequestStatus,
    nullable: true,
  })
  status?: DocumentRequestStatus;

  @Property({ type: 'uuid', nullable: true })
  driverId?: string;

  @Property({ type: 'text', nullable: true })
  driverName?: string;

  @Property({ type: 'text' })
  driverPhoneNumber!: string;

  @Property({ type: 'text' })
  url!: string;

  @Index()
  @ManyToOne(() => LoadEntity, { eager: false })
  load: Rel<LoadEntity>;
}
