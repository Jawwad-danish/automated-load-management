import { mockMikroORMProvider, mockToken } from '@core/test';
import { CommandRunner } from '@module-cqrs';
import { Test, TestingModule } from '@nestjs/testing';
import { UploadDocumentRequest } from '../data';
import { DeleteDocumentCommand, UploadDocumentCommand } from './commands';
import { DocumentService } from './document.service';

describe('DocumentService', () => {
  let documentService: DocumentService;
  let commandRunner: CommandRunner;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [mockMikroORMProvider, DocumentService],
    })
      .useMocker((token) => {
        return mockToken(token);
      })
      .compile();

    documentService = module.get(DocumentService);
    commandRunner = module.get(CommandRunner);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('Should be defined', () => {
    expect(documentService).toBeDefined();
  });

  it('When deleting document, command is sent', async () => {
    const runSpy = jest.spyOn(commandRunner, 'run');
    await documentService.delete('client-id', 'load-id', 'document-id');

    expect(runSpy).toHaveBeenCalledTimes(1);
    expect(runSpy.mock.calls[0][0]).toBeInstanceOf(DeleteDocumentCommand);
  });

  it('When uploading document, command is sent', async () => {
    const runSpy = jest.spyOn(commandRunner, 'run');
    await documentService.upload('client-id', 'load-id', [
      new UploadDocumentRequest(),
    ]);

    expect(runSpy).toHaveBeenCalledTimes(1);
    expect(runSpy.mock.calls[0][0]).toBeInstanceOf(UploadDocumentCommand);
  });
});
