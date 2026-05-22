import { Entity, Enum, Index, ManyToOne, Property, Rel } from '@mikro-orm/core';
import { BasicMutableEntity } from './basic-mutable.entity';
import { LoadEntity } from './load.entity';

export enum AddressType {
  Pickup = 'pickup',
  Delivery = 'delivery',
}

@Entity({ tableName: 'addresses' })
export class AddressEntity extends BasicMutableEntity {
  @Property({ type: 'text' })
  fullAddress!: string;

  @Property({ type: 'text' })
  city!: string;

  @Property({ type: 'text' })
  state!: string;

  @Enum({ type: 'enum', items: () => AddressType })
  type!: AddressType;

  @Property({
    type: 'timestamp',
    length: 3,
    nullable: true,
  })
  date?: Date;

  @Index()
  @ManyToOne(() => LoadEntity)
  load!: Rel<LoadEntity>;
}
