import { Test, TestingModule } from '@nestjs/testing';
import { Filestack } from './filestack';
import { FilestackConfigSupplier } from './filestack-config.supplier';
import { createMock } from '@golevelup/ts-jest';
import axios from 'axios';
import * as filestack from 'filestack-js';
import { mockToken } from '@core/test';
import { buildStubFilestackTransformResponse } from '../test/filestack.stubs';

jest.mock('axios');
jest.mock('filestack-js');

const mockFilestackConfig = {
  key: 'test-api-key',
  secret: 'test-secret',
};

describe('Filestack', () => {
  let service: Filestack;

  const filestackConfigSupplier: FilestackConfigSupplier =
    createMock<FilestackConfigSupplier>({
      get: jest.fn().mockResolvedValue(mockFilestackConfig),
    });

  const mockClient = createMock<filestack.Client>({
    metadata: jest.fn(),
    transform: jest.fn(),
  });

  beforeEach(async () => {
    jest.spyOn(filestack, 'init').mockReturnValue(mockClient);

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        Filestack,
        { provide: FilestackConfigSupplier, useValue: filestackConfigSupplier },
      ],
    })
      .useMocker((token) => {
        return mockToken(token);
      })
      .compile();

    service = module.get<Filestack>(Filestack);
  });

  describe('onModuleInit', () => {
    it('should initialize filestack client with the config key', async () => {
      await service.onModuleInit();

      expect(filestackConfigSupplier.get).toHaveBeenCalled();
      expect(filestack.init).toHaveBeenCalledWith(mockFilestackConfig.key);
      expect(service['client']).toBe(mockClient);
    });
  });

  describe('getStorage', () => {
    it('should return the correct s3Bucket and s3Key from the metadata', async () => {
      const url = 'https://cdn.filestackcontent.com/testhandle';
      const metadataResponse = {
        container: 'test-bucket',
        key: 'test-key',
      };

      mockClient.metadata.mockResolvedValueOnce(metadataResponse);

      await service.onModuleInit();
      const result = await service.getStorage(url);

      expect(mockClient.metadata).toHaveBeenCalledWith('testhandle');
      expect(result).toEqual({
        s3Bucket: metadataResponse.container,
        s3Key: metadataResponse.key,
      });
    });
  });

  describe('convertImageToPdf', () => {
    it('should return the transformed response as a PDF', async () => {
      const filestackUrl = 'https://cdn.filestackcontent.com/testhandle';
      const transformUrl = 'https://cdn.filestackcontent.com/transform-url';
      const mockTransformResponse = buildStubFilestackTransformResponse();

      mockClient.transform.mockReturnValueOnce(transformUrl);
      jest.spyOn(axios, 'get').mockResolvedValueOnce({
        data: mockTransformResponse,
      });

      await service.onModuleInit();
      const result = await service.convertImageToPdf(filestackUrl);

      expect(mockClient.transform).toHaveBeenCalledWith(
        'testhandle',
        expect.any(Object),
      );
      expect(axios.get).toHaveBeenCalledWith(transformUrl);
      expect(result).toEqual(mockTransformResponse);
    });

    it('should log an error and throw if the transformation fails', async () => {
      const filestackUrl = 'https://cdn.filestackcontent.com/testhandle';
      const transformUrl = 'https://cdn.filestackcontent.com/transform-url';

      mockClient.transform.mockReturnValueOnce(transformUrl);
      jest
        .spyOn(axios, 'get')
        .mockRejectedValueOnce(new Error('Network error'));

      await service.onModuleInit();

      await expect(service.convertImageToPdf(filestackUrl)).rejects.toThrow(
        'Network error',
      );
    });
  });
});
