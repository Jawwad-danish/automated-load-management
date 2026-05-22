import {
  Collection,
  Entity,
  Enum,
  Index,
  LoadStrategy,
  ManyToOne,
  OneToMany,
  Property,
  Rel,
} from '@mikro-orm/core';
import { BasicMutableEntity } from './basic-mutable.entity';
import { LoadEntity } from './load.entity';
import { DocumentRequestLinkEntity } from './document-request-link.entity';

export enum DocumentType {
  RateConfirmation = 'rate_confirmation',
  BillOfLading = 'bill_of_lading',
  LumperReceipt = 'lumper_receipt',
  ScaleTicket = 'scale_ticket',
}

export enum DocumentSubmissionType {
  Upload = 'upload',
  Request = 'request',
  Email = 'email',
}

@Entity({ tableName: 'documents' })
export class DocumentEntity extends BasicMutableEntity {
  @Property()
  name: string;

  @Property({ type: 'text' })
  s3Bucket: string;

  @Property({ type: 'text' })
  s3Key: string;

  @Enum({
    items: () => DocumentType,
    nullable: true,
  })
  type: DocumentType | null = null;

  @Enum({
    items: () => DocumentSubmissionType,
    nullable: true,
  })
  submissionType?: DocumentSubmissionType;

  @Property({ nullable: true })
  filestackUrl?: string;

  @Property({ nullable: false })
  label: string;

  @OneToMany(() => DocumentRequestLinkEntity, (link) => link.document, {
    eager: false,
    strategy: LoadStrategy.JOINED,
  })
  documentRequestLink = new Collection<DocumentRequestLinkEntity>(this);

  @Index()
  @ManyToOne(() => LoadEntity, { eager: false })
  load: Rel<LoadEntity>;
}
