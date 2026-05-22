import { Entity, Enum, OneToOne, Property, Rel } from '@mikro-orm/core';
import { BasicEntity } from './basic.entity';
import { PeruseDocumentResultEntity } from './peruse-document-result.entity';

export enum InternalJobStatus {
  Done = 'done', // successfully processed by us
  Error = 'error', // could not be processed by us
  Pending = 'pending', // Awaiting readiness from Peruse
  Ready = 'ready', // Ready to be processed by us
}

export enum InternalJobType {
  Classify = 'classify',
  ClassifyAndExtract = 'classify_and_extract',
  CreateLoad = 'create_load',
}

export enum JobEntityType {
  Document = 'document',
  Attachment = 'attachment',
  Load = 'load',
}

@Entity({ tableName: 'peruse_jobs' })
export class PeruseJobEntity extends BasicEntity {
  @Enum({
    items: () => InternalJobType,
    nullable: false,
    comment: 'Internal type of the job',
  })
  jobType: InternalJobType;

  @Enum({
    items: () => JobEntityType,
    nullable: false,
    comment: 'Type of entity that was submitted for the job',
  })
  entityType: JobEntityType;

  @Property({ type: 'uuid' })
  externalId: string;

  @Enum({
    items: () => InternalJobStatus,
    nullable: false,
    default: InternalJobStatus.Pending,
    comment: 'Internal status of the job',
  })
  internalStatus: InternalJobStatus = InternalJobStatus.Pending;

  @Property({ type: 'json', nullable: true, unique: false })
  error?: object;

  @OneToOne(() => PeruseDocumentResultEntity, { eager: false, nullable: true })
  result?: Rel<PeruseDocumentResultEntity>;
}
