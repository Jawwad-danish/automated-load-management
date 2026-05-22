import { Entity, Enum, Index, OneToOne, Property, Rel } from '@mikro-orm/core';
import { BasicEntity } from './basic.entity';
import { PeruseJobEntity } from './peruse-job.entity';

export enum PeruseJobStatus {
  Success = 'success',
  Error = 'error',
  Pending = 'pending',
}

@Entity({ tableName: 'peruse_documents_results' })
export class PeruseDocumentResultEntity extends BasicEntity {
  @Index()
  @OneToOne(() => PeruseJobEntity, { eager: false, nullable: false })
  job: Rel<PeruseJobEntity>;

  @Property({ type: 'json', nullable: false, unique: false })
  payload: object;

  @Enum({
    items: () => PeruseJobStatus,
    nullable: false,
    comment: 'Peruse job status',
  })
  status: PeruseJobStatus;
}
