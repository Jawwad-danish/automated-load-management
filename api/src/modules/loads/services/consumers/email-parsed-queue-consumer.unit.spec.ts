import { Message } from '@aws-sdk/client-sqs';
import { mockMikroORMProvider, mockToken } from '@core/test';
import { createMock } from '@golevelup/ts-jest';
import { CONFIG_SERVICE, Config, ConfigService } from '@module-config';
import { DatabaseService } from '@module-database';
import { EmailRepository } from '@module-persistence';
import { PeruseService } from '@module-peruse';
import { Test, TestingModule } from '@nestjs/testing';
import {
  EmailParsedQueueConsumer,
  QUEUE_URL_KEY,
} from './email-parsed-queue-consumer';

describe('EmailDocumentsProcessor', () => {
  let service: EmailParsedQueueConsumer;
  let peruseService: PeruseService;
  let emailRepository: EmailRepository;
  let databaseService: DatabaseService;

  const configServiceMock = createMock<ConfigService>();
  const configMock = new Config(QUEUE_URL_KEY, 'mockedUrl');
  configServiceMock.getValue.mockReturnValue(configMock);

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        mockMikroORMProvider,
        EmailParsedQueueConsumer,
        {
          provide: CONFIG_SERVICE,
          useValue: configServiceMock,
        },
      ],
    })
      .useMocker((token) => {
        return mockToken(token);
      })
      .compile();

    service = module.get<EmailParsedQueueConsumer>(EmailParsedQueueConsumer);
    peruseService = module.get(PeruseService);
    emailRepository = module.get(EmailRepository);
    databaseService = module.get(DatabaseService);
    jest
      .spyOn(databaseService, 'withRequestContext')
      .mockImplementation((fn) => {
        return fn();
      });
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('handleMessage', () => {
    it('should process and classify documents', async () => {
      const email = {
        body: 'test',
        subject: 'test',
        from: 'test@bobtail.com',
      };
      const attachment = {
        s3Bucket: 'bucket',
        s3Key: 'key',
      };
      const message: Message = {
        MessageId: '1',
        ReceiptHandle: 'handle',
        Body: JSON.stringify({
          ...email,
          attachments: [attachment],
        }),
      };
      const resultMessage = await service.handleMessage(message);

      expect(resultMessage).toBeDefined();
      expect(emailRepository.persist).toHaveBeenCalledWith(
        expect.objectContaining({
          body: email.body,
          fromEmail: email.from,
          subject: email.subject,
        }),
      );
      expect(peruseService.createLoadFromAttachments).toHaveBeenCalledWith(
        expect.arrayContaining([
          expect.objectContaining({
            s3Key: attachment.s3Key,
            s3Bucket: attachment.s3Bucket,
          }),
        ]),
      );
    });

    it('should return nothing if handling fails', async () => {
      const message: Message = {
        MessageId: '1',
        ReceiptHandle: 'handle',
        Body: 'invalid json',
      };
      const result = await service.handleMessage(message);
      expect(result).toBeUndefined();
    });
  });

  it('should not save emails if there are no attachments', async () => {
    const email = {
      body: 'test',
      subject: 'test',
      from: 'test@bobtail.com',
    };

    const message: Message = {
      MessageId: '1',
      ReceiptHandle: 'handle',
      Body: JSON.stringify({
        ...email,
        attachments: [],
      }),
    };
    const resultMessage = await service.handleMessage(message);

    expect(resultMessage).toBeDefined();
    expect(emailRepository.persist).toHaveBeenCalledTimes(0);
    expect(peruseService.createLoadFromAttachments).toHaveBeenCalledTimes(0);
  });
});
