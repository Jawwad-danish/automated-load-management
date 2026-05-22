import { Property } from '@mikro-orm/core';
import { BasicEntity } from './basic.entity';

export class BasicMutableEntity extends BasicEntity {
  @Property({
    type: 'timestamp',
    length: 3,
    onUpdate: () => new Date(),
  })
  updatedAt: Date = new Date();
}
