import { Entity, Index, ManyToOne, Rel } from '@mikro-orm/core';
import { BasicMutableEntity } from './basic-mutable.entity';
import { DocumentRequestEntity } from './document-request.entity';
import { DocumentEntity } from './document.entity';

@Entity({ tableName: 'document_requests_links' })
export class DocumentRequestLinkEntity extends BasicMutableEntity {
  @Index()
  @ManyToOne(() => DocumentRequestEntity, { eager: false })
  documentRequest: Rel<DocumentRequestEntity>;

  @Index()
  @ManyToOne(() => DocumentEntity, { eager: false })
  document: Rel<DocumentEntity>;
}
