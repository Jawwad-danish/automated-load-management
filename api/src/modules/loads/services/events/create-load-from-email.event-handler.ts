import { errorSerializer } from '@common';
import {
  Arrays,
  CrossCuttingConcerns,
  generateUniqueId,
  StateUtils,
} from '@core/util';
import { Broker, BrokerService, BrokerStatus } from '@module-brokers';
import { Client, ClientService } from '@module-clients';
import { DatabaseService, Transactional } from '@module-database';
import {
  AddressEntity,
  DocumentEntity,
  DocumentSubmissionType,
  EmailAttachmentEntity,
  EmailAttachmentRepository,
  EmailEntity,
  InternalJobStatus,
  JobEntityType,
  LoadEntity,
  LoadRepository,
  PeruseJobEntity,
  PeruseJobRepository,
} from '@module-persistence';
import {
  CreateLoadJobsReadyEvent,
  PeruseAddress,
  PeruseCreateLoadJobResult,
  PeruseLoadResponse,
  PeruseService,
} from '@module-peruse';
import { SegmentEvents, SegmentService } from '@module-segment';
import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class CreateLoadFromEmailEventHandler {
  private readonly logger = new Logger(CreateLoadFromEmailEventHandler.name);

  constructor(
    private readonly attachmentRepository: EmailAttachmentRepository,
    private readonly clientService: ClientService,
    private readonly brokerService: BrokerService,
    private readonly loadRepository: LoadRepository,
    private readonly jobsRepository: PeruseJobRepository,
    private readonly databaseService: DatabaseService,
    private readonly peruseService: PeruseService,
    private readonly analytics: SegmentService,
  ) {}

  @OnEvent('peruse.jobs.create-load.ready', { async: true })
  async handleEvent(event: CreateLoadJobsReadyEvent) {
    await this.databaseService.withRequestContext(async () => {
      try {
        const [jobs] = await this.jobsRepository.findAll(
          {
            id: { $in: event.jobIds },
          },
          { populate: ['result'] },
        );
        await this.processJobs(jobs);
      } catch (error) {
        this.logger.error(
          `Could not handle event peruse.jobs.create-load.ready - ${error}`,
        );
      }
    });
  }

  @Transactional('create-load-from-email')
  async processJobs(jobs: PeruseJobEntity[]): Promise<void> {
    if (!jobs.length) {
      this.logger.debug(
        'No jobs to process for event peruse.jobs.create-load.ready',
      );
      return;
    }
    this.logger.log(`Creating load from email for ${jobs.length} jobs`);
    await Arrays.mapAsync(jobs, (job) => this.processJob(job));
  }

  @CrossCuttingConcerns<CreateLoadFromEmailEventHandler, 'processJob'>({
    logging: (job: PeruseJobEntity) => {
      return {
        message: 'Processing Peruse Job for creating a load',
        job: job,
        jobId: job.id,
        loadId: job.externalId,
      };
    },
  })
  async processJob(job: PeruseJobEntity): Promise<void> {
    let jobPayload;
    try {
      jobPayload = plainToInstance(
        PeruseCreateLoadJobResult,
        job.result.payload,
      );

      const loadPayload = await this.peruseService.getLoad(
        jobPayload.getLoadId(),
      );

      await this.execute(jobPayload.getExternalIds(), jobPayload, loadPayload);
      job.internalStatus = InternalJobStatus.Done;
    } catch (err) {
      this.logger.error(
        `Could not create load from document for job id ${job.id} - ${err}`,
      );

      job.error = errorSerializer(err);
      job.internalStatus = InternalJobStatus.Error;

      const jobId = `${job.id}`;
      let clientName = 'Name not found';

      try {
        if (jobPayload) {
          const externalIds = jobPayload.getExternalIds();
          if (externalIds?.length > 0) {
            const [attachment] = await this.attachmentRepository.findByIds(
              externalIds,
              {
                populate: ['email'],
              },
            );
            const fromEmail = attachment?.email?.fromEmail ?? jobId;
            const client = fromEmail
              ? await this.clientService.getClientByEmail(fromEmail)
              : null;

            clientName = client?.name ?? clientName;

            this.analytics.track(fromEmail, SegmentEvents.LoadNotCreated, {
              reason: `${err.message}`,
              name: clientName,
            });

            return;
          }
        }
      } catch (fetchError) {
        this.logger.warn(
          `Failed to fetch additional client details: ${fetchError}`,
        );
      }

      this.analytics.track(jobId, SegmentEvents.LoadNotCreated, {
        reason: `${err.message}`,
        name: clientName,
      });
    }
  }

  @CrossCuttingConcerns<CreateLoadFromEmailEventHandler, 'execute'>({
    logging: (
      emailAttachmentIds: string[],
      createLoadResult: PeruseCreateLoadJobResult,
      loadResult: PeruseLoadResponse,
    ) => {
      return {
        message: 'Creating Load from email',
        emailAttachmentIds: emailAttachmentIds,
        createLoadJobResult: createLoadResult,
        loadResult: loadResult,
      };
    },
  })
  async execute(
    emailAttachmentIds: string[],
    createLoadResult: PeruseCreateLoadJobResult,
    loadResult: PeruseLoadResponse,
  ): Promise<{
    load: LoadEntity;
    documents: DocumentEntity[];
  }> {
    const attachments = await this.attachmentRepository.findByIds(
      emailAttachmentIds,
      {
        populate: ['email'],
      },
    );

    if (emailAttachmentIds.length !== attachments.length) {
      throw new Error('Could not find all related email attachments');
    }

    const email = attachments[0].email;
    const client = await this.clientService.getClientByEmail(email.fromEmail);
    let broker = await this.findBroker(createLoadResult, loadResult);

    if (broker && broker.status !== BrokerStatus.Active) {
      this.logger.log(
        `Broker ${broker.id} is not active. Creating load with broker not found`,
      );
      broker = null;
    }

    const documents = attachments.map((attachment) =>
      this.attachmentToDocument(attachment),
    );
    const load = this.resultToLoad(
      client,
      broker,
      email,
      createLoadResult,
      loadResult,
    );
    load.documents.add(documents);
    this.loadRepository.persist(load);

    await this.sendDocumentsForClassification(documents);
    this.analytics.identify(load.email.fromEmail, {
      email: load.email.fromEmail,
      name: client.name,
      dot: client.dot,
    });
    this.analytics.track(load.email.fromEmail, SegmentEvents.LoadCreated, {
      loadNumber: load.loadNumber,
      brokerId: load.brokerId,
      brokerName: load.brokerName,
      brokerEmail: load.brokerEmail,
      amount: load.totalAmount,
      docCount: load.documents.length,
    });

    return {
      load,
      documents,
    };
  }

  private resultToLoad(
    client: Client,
    broker: null | Broker,
    email: EmailEntity,
    jobResult: PeruseCreateLoadJobResult,
    loadResult: PeruseLoadResponse,
  ) {
    const entity = new LoadEntity();
    entity.brokerName = loadResult.getBrokerName();
    entity.internalBrokerName = broker?.legalName;
    entity.clientId = client.id;
    entity.brokerId = broker?.id;
    entity.email = email;
    entity.brokerEmail = loadResult.getBrokerEmail();
    entity.loadNumber = loadResult.getBrokerReferenceNumber();
    entity.totalAmount = loadResult.getTotalAmount();
    const pickupAddress = this.peruseAddressToAddressEntity(
      jobResult.getPickupAddress(),
    );
    const deliveryAddress = this.peruseAddressToAddressEntity(
      jobResult.getDeliveryAddress(),
    );
    entity.addresses.add(pickupAddress, deliveryAddress);
    return entity;
  }

  private peruseAddressToAddressEntity(address: PeruseAddress): AddressEntity {
    const entity = new AddressEntity();
    entity.fullAddress = address.fullAddress;
    entity.city = address.city;
    entity.state = StateUtils.getShortName(address.state);
    entity.type = address.type;
    entity.date = address.date;
    return entity;
  }

  private attachmentToDocument(
    attachment: EmailAttachmentEntity,
  ): DocumentEntity {
    const entity = new DocumentEntity();
    entity.id = generateUniqueId();
    entity.s3Key = attachment.s3Key;
    entity.s3Bucket = attachment.s3Bucket;
    entity.name = attachment.fileName;
    entity.label = 'email_attachment';
    entity.submissionType = DocumentSubmissionType.Email;
    return entity;
  }

  private async findBroker(
    createLoadResult: PeruseCreateLoadJobResult,
    loadResult: PeruseLoadResponse,
  ): Promise<null | Broker> {
    const brokerCanonicalID = loadResult.getBrokerCanonicalExternalId();
    if (brokerCanonicalID) {
      const broker = await this.brokerService.findOneByID(brokerCanonicalID);
      if (broker) {
        return broker;
      } else {
        this.logger.warn(
          `Canonical external ID ${brokerCanonicalID} could not be found in broker service. Please check`,
        );
      }
    }
    const brokerMC = loadResult.getBrokerMC();
    if (brokerMC) {
      const broker = await this.brokerService.findOneByMC(brokerMC);
      if (broker) return broker;
    }

    const brokerDOT = loadResult.getBrokerDOT();
    if (brokerDOT) {
      const broker = await this.brokerService.findOneByDOT(brokerDOT);
      if (broker) return broker;
    }

    const brokerNameCanonical = loadResult.getBrokerName();
    if (brokerNameCanonical) {
      const brokers = await this.brokerService.findByName(brokerNameCanonical);
      if (brokers && brokers.length === 1) {
        return brokers[0];
      }
    }

    const brokerNames = createLoadResult.getBrokerNames();
    if (brokerNames) {
      for (const name of brokerNames) {
        const brokers = await this.brokerService.findByName(name);
        if (brokers && brokers.length === 1) {
          return brokers[0];
        }
      }
    }

    return null;
  }

  private async sendDocumentsForClassification(
    documents: DocumentEntity[],
  ): Promise<void> {
    const promises = documents.map((doc) => {
      return this.peruseService.classifyDocument({
        externalId: doc.id,
        s3Bucket: doc.s3Bucket,
        s3Key: doc.s3Key,
        type: JobEntityType.Document,
        extract: false,
      });
    });
    await Promise.all(promises);
  }
}
