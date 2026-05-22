import { PrimaryKey, Property, UuidType, Enum } from '@mikro-orm/core';
import { PrimitiveEntity, RecordStatus } from './primitive.entity';

export class BasicEntity extends PrimitiveEntity {
  @PrimaryKey({
    type: UuidType,
    defaultRaw: 'uuid_generate_v4()',
  })
  id: string;

  @Property({
    type: 'timestamp',
    nullable: false,
    length: 3,
  })
  createdAt: Date = new Date();

  @Enum({
    items: () => RecordStatus,
    default: RecordStatus.Active,
    nullable: false,
  })
  recordStatus: RecordStatus = RecordStatus.Active;
}
