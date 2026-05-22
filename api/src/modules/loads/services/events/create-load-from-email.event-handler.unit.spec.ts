import { mockMikroORMProvider, mockToken } from '@core/test';
import { StateUtils } from '@core/util';
import { BrokerService, BrokerStatus, buildStubBroker } from '@module-brokers';
import { buildStubClient, ClientService } from '@module-clients';
import {
  AddressType,
  DocumentSubmissionType,
} from '@module-persistence/entities';
import {
  EmailAttachmentRepository,
  PeruseJobRepository,
} from '@module-persistence/repositories';
import {
  buildStubEmailAttachmentEntity,
  buildStubEmailEntity,
  buildStubPeruseJobEntity,
} from '@module-persistence/test';
import {
  buildStubPeruseCreateLoadJobResult,
  buildStubPeruseLoadResponse,
  PeruseService,
} from '@module-peruse';
import { Test, TestingModule } from '@nestjs/testing';
import { CreateLoadFromEmailEventHandler } from './create-load-from-email.event-handler';

describe('CreateLoadFromAttachmentEventHandler', () => {
  let handler: CreateLoadFromEmailEventHandler;
  let emailAttachmentRepository: EmailAttachmentRepository;
  let jobRepository: PeruseJobRepository;
  let clientService: ClientService;
  let brokerService: BrokerService;
  let peruseService: PeruseService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [mockMikroORMProvider, CreateLoadFromEmailEventHandler],
    })
      .useMocker((token) => {
        return mockToken(token);
      })
      .compile();

    handler = module.get(CreateLoadFromEmailEventHandler);
    emailAttachmentRepository = module.get(EmailAttachmentRepository);
    jobRepository = module.get(PeruseJobRepository);
    clientService = module.get(ClientService);
    brokerService = module.get(BrokerService);
    peruseService = module.get(PeruseService);
  });

  describe('execute', () => {
    it('should create load and documents from attachments', async () => {
      const mockJobs = [buildStubPeruseJobEntity()];
      jest
        .spyOn(jobRepository, 'findAll')
        .mockResolvedValueOnce([mockJobs, mockJobs.length]);
      const attachmentIds = ['attachment-id'];
      const jobPayload = buildStubPeruseCreateLoadJobResult();
      const loadPayload = buildStubPeruseLoadResponse();

      const expectedBrokerName = loadPayload.getBrokerName();
      const expectedBrokerEmail = loadPayload.getBrokerEmail();
      const expectedPickupAddress = jobPayload.getPickupAddress();
      const expectedDeliveryAddress = jobPayload.getDeliveryAddress();
      const expectedRate = loadPayload.getTotalAmount();

      jest.spyOn(peruseService, 'getLoad').mockResolvedValueOnce(loadPayload);

      const attachment = buildStubEmailAttachmentEntity({
        id: attachmentIds[0],
      });
      attachment.email = buildStubEmailEntity({
        fromEmail: 'test@example.com',
      });
      jest
        .spyOn(emailAttachmentRepository, 'findByIds')
        .mockResolvedValue([attachment]);

      const client = buildStubClient({ id: 'client-id' });
      jest.spyOn(clientService, 'getClientByEmail').mockResolvedValue(client);

      const broker = buildStubBroker({});
      jest.spyOn(brokerService, 'findByName').mockResolvedValueOnce([broker]);

      const result = await handler.execute(
        attachmentIds,
        jobPayload,
        loadPayload,
      );

      expect(emailAttachmentRepository.findByIds).toHaveBeenCalledWith(
        attachmentIds,
        { populate: ['email'] },
      );
      expect(clientService.getClientByEmail).toHaveBeenCalledWith(
        'test@example.com',
      );
      expect(result).toHaveProperty('load');
      expect(result).toHaveProperty('documents');

      const loadEntity = result.load;
      expect(loadEntity.brokerEmail).toBe(expectedBrokerEmail);
      expect(loadEntity.brokerName).toBe(expectedBrokerName);
      expect(loadEntity.internalBrokerName).toBe(broker.legalName);
      expect(loadEntity.clientId).toBe(client.id);
      expect(loadEntity.email.fromEmail).toBe('test@example.com');
      expect(loadEntity.totalAmount.toString()).toStrictEqual(
        expectedRate.toString(),
      );
      expect(loadEntity.documents[0]).toMatchObject({
        s3Key: attachment.s3Key,
        s3Bucket: attachment.s3Bucket,
        name: attachment.fileName,
        label: 'email_attachment',
        submissionType: DocumentSubmissionType.Email,
      });
      const pickupAddress = loadEntity.addresses.find((item) => {
        return item.type === AddressType.Pickup;
      });
      expect(pickupAddress).toBeDefined();
      expect(pickupAddress.city).toBe(expectedPickupAddress.city);
      expect(pickupAddress.fullAddress).toBe(expectedPickupAddress.fullAddress);
      expect(pickupAddress.state).toBe(
        StateUtils.getShortName(expectedPickupAddress.state),
      );
      expect(pickupAddress.date).toStrictEqual(expectedPickupAddress.date);

      const deliveryAddress = loadEntity.addresses.find((item) => {
        return item.type === AddressType.Delivery;
      });
      expect(deliveryAddress).toBeDefined();
      expect(deliveryAddress.city).toBe(expectedDeliveryAddress.city);
      expect(deliveryAddress.fullAddress).toBe(
        expectedDeliveryAddress.fullAddress,
      );
      expect(deliveryAddress.state).toBe(
        StateUtils.getShortName(expectedDeliveryAddress.state),
      );
      expect(deliveryAddress.date).toStrictEqual(expectedDeliveryAddress.date);
    });

    it('load is created with broker not found if broker is inactive', async () => {
      const mockJobs = [buildStubPeruseJobEntity()];
      jest
        .spyOn(jobRepository, 'findAll')
        .mockResolvedValueOnce([mockJobs, mockJobs.length]);
      const attachmentIds = ['attachment-id'];
      const jobPayload = buildStubPeruseCreateLoadJobResult();
      const loadPayload = buildStubPeruseLoadResponse();

      jest.spyOn(peruseService, 'getLoad').mockResolvedValueOnce(loadPayload);

      const attachment = buildStubEmailAttachmentEntity({
        id: attachmentIds[0],
      });
      attachment.email = buildStubEmailEntity({
        fromEmail: 'test@example.com',
      });
      jest
        .spyOn(emailAttachmentRepository, 'findByIds')
        .mockResolvedValue([attachment]);

      const client = buildStubClient({ id: 'client-id' });
      jest.spyOn(clientService, 'getClientByEmail').mockResolvedValue(client);

      const broker = buildStubBroker({ status: BrokerStatus.Inactive });
      jest.spyOn(brokerService, 'findByName').mockResolvedValueOnce([broker]);

      const result = await handler.execute(
        attachmentIds,
        jobPayload,
        loadPayload,
      );

      expect(result.load.brokerId).toBeUndefined();
    });
  });
});
