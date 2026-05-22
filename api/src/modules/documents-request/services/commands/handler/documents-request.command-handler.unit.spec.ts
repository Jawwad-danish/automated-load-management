import {
  DocumentRequestEntity,
  DriverEntity,
  DriverRepository,
  LoadEntity,
  LoadRepository,
  DocumentRequestRepository,
  AddressEntity,
  AddressType,
} from '@module-persistence';
import { Test, TestingModule } from '@nestjs/testing';
import { SendDocumentRequestCommand } from '../document-request.command';
import { DocumentRequestCommandHandler } from './document-request.command-handler';
import { TwilioService } from '@module-twilio';
import { mockMikroORMProvider, mockToken } from '@core/test';
import { v4 } from 'uuid';
import { MessageInstance } from 'twilio/lib/rest/api/v2010/account/message';

describe('DocumentRequestCommandHandler', () => {
  let documentRequestRepository: DocumentRequestRepository;
  let driverRepository: DriverRepository;
  let loadRepository: LoadRepository;
  let handler: DocumentRequestCommandHandler;
  let twilioService: TwilioService;

  const mockDriverEntity = new DriverEntity();
  const mockLoadEntity = new LoadEntity();
  const mockDocumentRequestEntity = new DocumentRequestEntity();
  const mockAddressEntity = new AddressEntity();

  let messageInstance: MessageInstance;

  mockDriverEntity.id = v4();
  mockDriverEntity.phoneNumber = '1234567890';
  mockLoadEntity.id = v4();
  mockLoadEntity.loadNumber = '12345';
  mockDocumentRequestEntity.id = v4();
  mockAddressEntity.id = v4();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [mockMikroORMProvider, DocumentRequestCommandHandler],
    })
      .useMocker((token) => {
        return mockToken(token);
      })
      .compile();

    documentRequestRepository = module.get(DocumentRequestRepository);
    driverRepository = module.get(DriverRepository);
    loadRepository = module.get(LoadRepository);
    twilioService = module.get(TwilioService);

    handler = module.get(DocumentRequestCommandHandler);

    // Set up mock addresses
    mockAddressEntity.type = AddressType.Delivery;
    mockAddressEntity.city = 'MockCity';
    mockAddressEntity.state = 'MockState';

    mockLoadEntity.addresses.add(mockAddressEntity);
  });

  const mockDriverFindOne = () => {
    return jest
      .spyOn(driverRepository, 'getOneById')
      .mockResolvedValueOnce(mockDriverEntity);
  };

  const mockLoadGetOne = () => {
    return jest
      .spyOn(loadRepository, 'getOneByClientAndId')
      .mockResolvedValueOnce(mockLoadEntity);
  };

  const mockCreateDocumentRequestPersist = () => {
    return jest
      .spyOn(documentRequestRepository, 'persistAndFlush')
      .mockResolvedValueOnce(mockDocumentRequestEntity);
  };

  const mockTwilioService = () => {
    return jest
      .spyOn(twilioService, 'sendMessage')
      .mockResolvedValueOnce(messageInstance);
  };

  const mockGetUrl = () => {
    return jest
      .spyOn(twilioService, 'getUrl')
      .mockReturnValue('http://mockurl.com');
  };

  it('should be defined', () => {
    expect(handler).toBeDefined();
  });

  it('creates a new document request and notifies the driver', async () => {
    mockDriverFindOne();
    mockLoadGetOne();
    mockCreateDocumentRequestPersist();
    mockTwilioService();
    mockGetUrl();

    await handler.execute(
      new SendDocumentRequestCommand('client-id', 'load-id', 'driver-id'),
    );

    expect(documentRequestRepository.persistAndFlush).toHaveBeenCalled();
    expect(twilioService.sendMessage).toHaveBeenCalledWith(
      mockDriverEntity.phoneNumber,
      expect.stringContaining('Please upload the documents for'),
    );
  });
});
