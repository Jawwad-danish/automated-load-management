import { mockMikroORMProvider, mockToken } from '@core/test';
import {
  DocumentRequestRepository,
  LoadRepository,
} from '@module-persistence/repositories';
import {
  buildStubDocumentEntity,
  buildStubDocumentRequestEntity,
  buildStubLoadEntity,
} from '@module-persistence/test';
import { Test, TestingModule } from '@nestjs/testing';
import {
  DocumentMapper,
  UploadDocumentRequest,
  UploadScannedDocumentRequest,
} from '../../../data';
import { UploadScannedDocumentCommand } from '../upload-scanned-document.comand';
import { UploadScannedDocumentCommandHandler } from './upload-scanned-document.command-handler';

describe('UploadScannedDocumentCommandHandler', () => {
  let loadRepository: LoadRepository;
  let documentRequestRepository: DocumentRequestRepository;
  let mapper: DocumentMapper;
  let handler: UploadScannedDocumentCommandHandler;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [mockMikroORMProvider, UploadScannedDocumentCommandHandler],
    })
      .useMocker((token) => {
        return mockToken(token);
      })
      .compile();

    loadRepository = module.get(LoadRepository);
    documentRequestRepository = module.get(DocumentRequestRepository);
    mapper = module.get(DocumentMapper);
    handler = module.get(UploadScannedDocumentCommandHandler);
  });

  it('Should be defined', () => {
    expect(handler).toBeDefined();
  });

  it('When load and request are found, documents are added to the load', async () => {
    const load = buildStubLoadEntity();
    const documentRequest = buildStubDocumentRequestEntity({ load });
    jest.spyOn(loadRepository, 'getOneById').mockResolvedValueOnce(load);
    jest
      .spyOn(documentRequestRepository, 'getOneById')
      .mockResolvedValueOnce(documentRequest);
    jest
      .spyOn(mapper, 'uploadDocumentToEntity')
      .mockResolvedValueOnce(buildStubDocumentEntity());

    const req = new UploadScannedDocumentRequest();
    req.documentsRequest = [new UploadDocumentRequest()];

    await handler.execute(new UploadScannedDocumentCommand(req));

    expect(load.documents.count()).toBe(1);
  });
});
