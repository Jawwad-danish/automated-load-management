import { createHash, createHmac } from 'node:crypto';
import { configure } from 'safe-stable-stringify';

// safe-stable-stringify guarantees a deterministic key order instead of relying on the insertion order
const stringify = configure({
  deterministic: true,
});

export const createSHA1FromObject = (data: object): string => {
  return createHash('sha1').update(stringify(data)).digest('hex');
};

export const createSHA256FromObject = (data: object): string => {
  return createHash('sha256').update(stringify(data)).digest('hex');
};

export const createSHA256FromObjectWithSpace = (
  data: object,
  space: number,
): string => {
  return createHash('sha256')
    .update(stringify(data, null, space))
    .digest('hex');
};

export const createHMACWithKey = (data: any, key: string): string => {
  return createHmac('sha256', key).update(data).digest('hex');
};
