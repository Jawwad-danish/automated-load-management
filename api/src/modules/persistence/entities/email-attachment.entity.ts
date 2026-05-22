import { Entity, Index, ManyToOne, Property, Rel } from '@mikro-orm/core';
import { BasicMutableEntity } from './basic-mutable.entity';
import { EmailEntity } from './email.entity';

@Entity({ tableName: 'email_attachments' })
export class EmailAttachmentEntity extends BasicMutableEntity {
  @Property({ type: 'text' })
  fileName!: string;

  @Property({ type: 'text' })
  contentType!: string;

  @Property({ type: 'text' })
  s3Bucket!: string;

  @Property({ type: 'text' })
  s3Key!: string;

  @Index()
  @ManyToOne(() => EmailEntity, { eager: false })
  email!: Rel<EmailEntity>;
}
