import { Type } from '@mikro-orm/core';
import Big from 'big.js';

export class BigJsType extends Type<Big, number> {
  convertToDatabaseValue(value: Big): number {
    return value.toNumber();
  }

  convertToJSValue(value: number): Big {
    return new Big(value);
  }

  getColumnType(): string {
    return `numeric`;
  }
}
