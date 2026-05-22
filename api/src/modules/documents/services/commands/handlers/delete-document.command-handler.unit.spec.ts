import { EntityNotFoundError } from '@core/errors';
import { mockToken } from '@core/test';
import { RecordStatus } from '@module-persistence/entities';
import { DocumentRepository } from '@module-persistence/repositories';
import { buildStubDocumentEntity } from '@module-persistence/test';
import { Test, TestingModule } from '@nestjs/testing';
import { DeleteDocumentCommand } from '../delete-document.command';
import { DeleteDocumentCommandHandler } from './delete-document.command-handler';

describe('DeleteDocumentCommandHandler', () => {
  let documentRepository: DocumentRepository;
  let handler: DeleteDocumentCommandHandler;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DeleteDocumentCommandHandler],
    })
      .useMocker((token) => {
        return mockToken(token);
      })
      .compile();

    documentRepository = module.get(DocumentRepository);
    handler = module.get(DeleteDocumentCommandHandler);
  });

  it('Should be defined', () => {
    expect(handler).toBeDefined();
  });

  it('When no document is found, exception is thrown', async () => {
    jest.spyOn(documentRepository, 'findInLoad').mockResolvedValueOnce(null);

    expect(
      handler.execute(
        new DeleteDocumentCommand('client-id', 'load-id', 'document-id'),
      ),
    ).rejects.toThrow(EntityNotFoundError);
  });

  it('When document is found, record status is set to inactive', async () => {
    const document = buildStubDocumentEntity();
    jest
      .spyOn(documentRepository, 'findInLoad')
      .mockResolvedValueOnce(document);

    await handler.execute(
      new DeleteDocumentCommand('client-id', 'load-id', 'document-id'),
    );

    expect(document.recordStatus).toBe(RecordStatus.Inactive);
  });
});
