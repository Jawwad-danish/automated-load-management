import { mockMikroORMProvider, mockToken } from '@core/test';
import { Loaded } from '@mikro-orm/core';
import {
  DocumentRepository,
  DocumentType,
  InternalJobStatus,
  PeruseJobEntity,
  PeruseJobRepository,
} from '@module-persistence';
import {
  buildStubDocumentEntity,
  buildStubPeruseJobEntity,
} from '@module-persistence/test';
import { Test, TestingModule } from '@nestjs/testing';
import { ClassificationJobsReadyEvent } from '@module-peruse';
import { UpdateDocumentEventHandler } from './update-document-type.event-handler';
import { errorSerializer } from '@common';

describe('UpdateDocumentTypeJob', () => {
  let handler: UpdateDocumentEventHandler;
  let jobRepository: jest.Mocked<PeruseJobRepository>;
  let documentRepository: jest.Mocked<DocumentRepository>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [mockMikroORMProvider, UpdateDocumentEventHandler],
    })
      .useMocker((token) => {
        return mockToken(token);
      })
      .compile();

    handler = module.get<UpdateDocumentEventHandler>(
      UpdateDocumentEventHandler,
    );
    jobRepository = module.get(PeruseJobRepository);
    documentRepository = module.get(DocumentRepository);
  });

  describe('update document type', () => {
    it('should update job status and document type', async () => {
      const mockJobs = [
        buildStubPeruseJobEntity(),
        buildStubPeruseJobEntity(),
      ] as Loaded<PeruseJobEntity, string>[];
      jest
        .spyOn(jobRepository, 'findAll')
        .mockResolvedValueOnce([mockJobs, mockJobs.length]);

      const documents = [buildStubDocumentEntity(), buildStubDocumentEntity()];

      for (const doc of documents) {
        jest.spyOn(documentRepository, 'getOneById').mockResolvedValueOnce(doc);
      }

      const documentFindSpy = jest.spyOn(documentRepository, 'getOneById');

      const event = new ClassificationJobsReadyEvent({ jobIds: ['1'] });
      await handler.labelDocuments(event);

      expect(jobRepository.findAll).toHaveBeenCalledWith(
        {
          id: { $in: ['1'] },
        },
        { populate: ['result'] },
      );

      expect(documentFindSpy).toHaveBeenCalledTimes(mockJobs.length);
      for (const job of mockJobs) {
        expect(job.internalStatus).toBe(InternalJobStatus.Done);
      }
      for (const doc of documents) {
        expect(doc.type).toBe(DocumentType.RateConfirmation); // default value on stubs
      }
    });

    it('should handle when no jobs are found', async () => {
      const spy = jest
        .spyOn(jobRepository, 'findAll')
        .mockResolvedValue([[], 0]);

      const event = new ClassificationJobsReadyEvent({ jobIds: ['1'] });
      await handler.labelDocuments(event);

      expect(spy).toHaveBeenCalledWith(
        {
          id: { $in: ['1'] },
        },
        { populate: ['result'] },
      );
    });

    it('should handle errors during labelDocuments', async () => {
      const mockJob = buildStubPeruseJobEntity();
      jest
        .spyOn(jobRepository, 'findAll')
        .mockResolvedValueOnce([[mockJob], 1]);

      const errorMock = new Error('Test Error');
      jest.spyOn(documentRepository, 'getOneById').mockRejectedValue(errorMock);
      const event = new ClassificationJobsReadyEvent({ jobIds: ['1'] });
      await expect(handler.labelDocuments(event)).resolves.not.toThrow();

      expect(mockJob.internalStatus).toBe(InternalJobStatus.Error);
      expect(mockJob.error).toStrictEqual(errorSerializer(errorMock));
    });
  });
});
