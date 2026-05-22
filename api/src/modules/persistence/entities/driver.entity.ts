import { Entity, Property } from '@mikro-orm/core';
import { BasicMutableEntity } from './basic-mutable.entity';

@Entity({ tableName: 'drivers' })
export class DriverEntity extends BasicMutableEntity {
  @Property({ type: 'uuid' })
  clientId!: string;

  @Property({ type: 'text' })
  name!: string;

  @Property({ type: 'text' })
  phoneNumber!: string;
}
