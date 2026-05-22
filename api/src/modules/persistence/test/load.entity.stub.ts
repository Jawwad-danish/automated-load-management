import { generateUniqueId } from '@core/util';
import Big from 'big.js';
import {
  DocumentEntity,
  LoadEntity,
  DocumentStatus,
  FactoredStatus,
  RecordStatus,
  TagDefinitionEntity,
  ActivityLogEntity,
  TagStatus,
  LoadTagEntity,
  EmailEntity,
} from '../entities';

export const buildStubLoadEntity = (
  data?: Partial<
    Omit<LoadEntity, 'documents' | 'tags' | 'activities'> & {
      documents?: DocumentEntity[];
      tags?: LoadTagEntity[];
      activities?: ActivityLogEntity[];
    }
  >,
) => {
  const email: EmailEntity = new EmailEntity();
  email.fromEmail = 'Client email';
  const entity = new LoadEntity();
  entity.loadNumber = 'load';
  entity.email = email;
  entity.totalAmount = new Big(1000);
  entity.brokerName = 'Broker name';
  entity.brokerEmail = 'Broker email';
  entity.clientId = generateUniqueId();
  entity.brokerId = generateUniqueId();
  entity.factoredStatus = FactoredStatus.None;
  entity.documentStatus = DocumentStatus.DocReceived;
  entity.createdAt = new Date();
  entity.recordStatus = RecordStatus.Active;
  if (data?.documents) {
    entity.documents.hydrate(data.documents);
    delete data.documents;
  }

  if (data?.tags) {
    entity.tags.hydrate(data.tags);
    delete data.tags;
  }

  if (data?.activities) {
    entity.activities.hydrate(data.activities);
    delete data.activities;
  }

  if (data) {
    Object.assign(entity, data);
  }
  return entity;
};

export const buildStubActivityEntity = (tag: TagDefinitionEntity) => {
  const entity = new ActivityLogEntity();
  entity.id = generateUniqueId();
  entity.tagDefinition = tag;
  entity.recordStatus = RecordStatus.Active;
  entity.tagStatus = TagStatus.Active;
  entity.createdAt = new Date();
  return entity;
};

export const buildStubLoadTagEntity = (
  tag: TagDefinitionEntity,
): LoadTagEntity => {
  const entity = new LoadTagEntity();
  entity.id = generateUniqueId();
  entity.tagDefinition = tag;
  entity.createdAt = new Date();
  entity.recordStatus = RecordStatus.Active;
  return entity;
};
