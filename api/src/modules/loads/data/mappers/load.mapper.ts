import { DataMapper, DataMapperUtil } from '@core/mapping';
import { Arrays, StateUtils } from '@core/util';
import { DocumentsRequestMapper } from '@module-documents-request/data';
import { DocumentMapper } from '@module-documents/data';
import { LoadEntity } from '@module-persistence/entities';
import { Injectable } from '@nestjs/common';
import { Address, Load, Location } from '../models';
import { TagDefinitionMapper } from '@module-tag-definitions';
import { ActivityLogMapper } from './activity-log.mapper';

@Injectable()
export class LoadMapper implements DataMapper<LoadEntity, Load> {
  constructor(
    private readonly documentMapper: DocumentMapper,
    private readonly documentRequestMapper: DocumentsRequestMapper,
    private readonly tagsMapper: TagDefinitionMapper,
    private readonly activityMapper: ActivityLogMapper,
  ) {}

  async entityToModel(entity: LoadEntity): Promise<Load> {
    let locations, documents, documentRequests, tags, activities;

    if (entity.addresses.isInitialized()) {
      locations = DataMapperUtil.mapCollections(entity.addresses, (address) => {
        return new Location({
          address: new Address({
            fullAddress: address.fullAddress,
            city: address.city,
            state: StateUtils.getShortName(address.state),
          }),
          type: address.type,
          createdAt: address.createdAt,
          updatedAt: address.updatedAt,
          recordStatus: address.recordStatus,
        });
      });
    }

    if (entity.documents.isInitialized()) {
      documents = await Arrays.mapAsync(entity.documents.getItems(), (e) =>
        this.documentMapper.entityToModel(e),
      );
    }

    if (entity.documentRequests.isInitialized()) {
      documentRequests = await Arrays.mapAsync(
        entity.documentRequests.getItems(),
        (e) => this.documentRequestMapper.entityToModel(e),
      );
    }

    if (entity.tags.isInitialized()) {
      tags = await Arrays.mapAsync(entity.tags.getItems(), (e) =>
        this.tagsMapper.entityToModel(e.tagDefinition),
      );
    }

    if (entity.activities.isInitialized()) {
      activities = await Arrays.mapAsync(entity.activities.getItems(), (e) =>
        this.activityMapper.entityToModel(e),
      );
    }

    return new Load({
      id: entity.id,
      loadNumber: entity.loadNumber,
      totalAmount: entity.totalAmount,
      date: entity.createdAt,
      email: entity.email.fromEmail,
      brokerId: entity.brokerId,
      brokerEmail: entity.brokerEmail,
      brokerName: entity.brokerName,
      invoiceId: entity.invoiceId,
      isRead: entity.isRead,
      documentStatus: entity.documentStatus,
      factoredStatus: entity.factoredStatus,
      locations: locations,
      documents: documents,
      documentRequested: documentRequests,
      tags: tags,
      activities: activities,
    });
  }
}
