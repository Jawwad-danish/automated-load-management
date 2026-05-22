import {
  Entity,
  OneToMany,
  Property,
  Collection,
  OneToOne,
  Rel,
} from '@mikro-orm/core';
import { BasicMutableEntity } from './basic-mutable.entity';
import { EmailAttachmentEntity } from './email-attachment.entity';
import { LoadEntity } from './load.entity';

@Entity({ tableName: 'emails' })
export class EmailEntity extends BasicMutableEntity {
  @Property({ type: 'text' })
  fromEmail!: string;

  @Property({ type: 'text', nullable: true })
  fromName?: string;

  @Property({ type: 'text', nullable: true })
  subject?: string;

  @Property({ type: 'text' })
  body!: string;

  @Property({ type: 'text' })
  s3Bucket!: string;

  @Property({ type: 'text' })
  s3Key!: string;

  @Property({ type: 'text' })
  messageId!: string;

  @OneToMany(() => EmailAttachmentEntity, (attachment) => attachment.email)
  attachments = new Collection<EmailAttachmentEntity>(this);

  @OneToOne(() => LoadEntity, (load) => load.email)
  load: Rel<LoadEntity>;
}
