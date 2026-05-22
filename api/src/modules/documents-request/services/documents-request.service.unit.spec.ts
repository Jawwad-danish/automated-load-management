import { mockMikroORMProvider, mockToken } from '@core/test';
import { CommandRunner } from '@module-cqrs';
import { Test, TestingModule } from '@nestjs/testing';
import { SendDocumentRequestCommand } from './commands';
import { DocumentsRequestService } from './documents-request.service';

describe('DocumentsRequestService', () => {
  let documentsRequestService: DocumentsRequestService;
  let commandRunner: CommandRunner;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [mockMikroORMProvider, DocumentsRequestService],
    })
      .useMocker((token) => {
        return mockToken(token);
      })
      .compile();
    documentsRequestService = module.get(DocumentsRequestService);
    commandRunner = module.get(CommandRunner);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('Should be defined', () => {
    expect(documentsRequestService).toBeDefined();
  });

  it('When creating request, command is sent', async () => {
    const runSpy = jest.spyOn(commandRunner, 'run');
    await documentsRequestService.sendRequest(
      'client-id',
      'load-id',
      'driver-id',
    );

    expect(runSpy).toHaveBeenCalledTimes(1);
    expect(runSpy.mock.calls[0][0]).toBeInstanceOf(SendDocumentRequestCommand);
  });
});
