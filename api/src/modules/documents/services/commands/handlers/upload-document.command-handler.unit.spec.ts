import { mockMikroORMProvider, mockToken } from '@core/test';
import { LoadRepository } from '@module-persistence/repositories';
import {
  buildStubDocumentEntity,
  buildStubLoadEntity,
} from '@module-persistence/test';
import { Test, TestingModule } from '@nestjs/testing';
import { DocumentMapper, UploadDocumentRequest } from '../../../data';
import { UploadDocumentCommand } from '../upload-document.command';
import { UploadDocumentCommandHandler } from './upload-document.command-handler';
import { Filestack } from '@module-filestack';
import { buildStubFilestackTransformResponse } from '@module-filestack/test';

describe('UploadDocumentCommandHandler', () => {
  let loadRepository: LoadRepository;
  let mapper: DocumentMapper;
  let handler: UploadDocumentCommandHandler;
  let filestack: Filestack;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [mockMikroORMProvider, UploadDocumentCommandHandler],
    })
      .useMocker((token) => {
        return mockToken(token);
      })
      .compile();

    loadRepository = module.get(LoadRepository);
    mapper = module.get(DocumentMapper);
    handler = module.get(UploadDocumentCommandHandler);
    filestack = module.get(Filestack);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('Should be defined', () => {
    expect(handler).toBeDefined();
  });

  it('When load is found, documents are added to the load', async () => {
    const load = buildStubLoadEntity();
    jest
      .spyOn(loadRepository, 'getOneByClientAndId')
      .mockResolvedValueOnce(load);
    jest
      .spyOn(mapper, 'uploadDocumentToEntity')
      .mockResolvedValueOnce(buildStubDocumentEntity());

    await handler.execute(
      new UploadDocumentCommand('client-id', 'load-id', [
        new UploadDocumentRequest(),
      ]),
    );

    expect(load.documents.count()).toBe(1);
  });

  it('PNG documents are converted to PDF', async () => {
    const load = buildStubLoadEntity();
    const imageDocumentStub = buildStubDocumentEntity({
      name: 'test123.png',
      filestackUrl: 'filestack-url',
    });
    const filestackResponseStub = buildStubFilestackTransformResponse();
    jest
      .spyOn(loadRepository, 'getOneByClientAndId')
      .mockResolvedValueOnce(load);
    jest
      .spyOn(mapper, 'uploadDocumentToEntity')
      .mockResolvedValueOnce(imageDocumentStub);
    jest
      .spyOn(filestack, 'convertImageToPdf')
      .mockResolvedValueOnce(filestackResponseStub);

    await handler.execute(
      new UploadDocumentCommand('client-id', 'load-id', [
        new UploadDocumentRequest(),
      ]),
    );

    expect(load.documents.count()).toBe(1);
    expect(filestack.convertImageToPdf).toHaveBeenCalledWith('filestack-url');
    expect(imageDocumentStub.filestackUrl).toBe(filestackResponseStub.url);
    expect(imageDocumentStub.s3Bucket).toBe(filestackResponseStub.container);
    expect(imageDocumentStub.s3Key).toBe(filestackResponseStub.key);
    expect(imageDocumentStub.name).toBe(filestackResponseStub.filename);
  });
});
