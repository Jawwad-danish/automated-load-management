// filestack.mocks.ts

import { FilestackStorage, TransformResponse } from '../services';

export function buildStubFilestackTransformResponse(
  data?: Partial<TransformResponse>,
): TransformResponse {
  const response: TransformResponse = {
    container: 'test-bucket',
    filename: 'test.pdf',
    handle: 'testhandle',
    key: 'test-key',
    size: 12345,
    type: 'application/pdf',
    url: 'https://cdn.filestackcontent.com/test.pdf',
  };
  Object.assign(response, data);
  return response;
}

export function buildStubFilestackStorage(
  data?: Partial<FilestackStorage>,
): FilestackStorage {
  const response: FilestackStorage = {
    s3Bucket: 'test-bucket',
    s3Key: 'test-key',
  };
  Object.assign(response, data);
  return response;
}
