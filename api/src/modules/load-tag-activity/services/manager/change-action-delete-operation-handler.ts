import { ChangeAction, ChangeSubject } from '@common';
import {
  ActivityLogEntity,
  LoadEntity,
  RecordStatus,
  TagDefinitionEntity,
  TagDefinitionRepository,
  TagStatus,
} from '@module-persistence';
import { Injectable, Logger } from '@nestjs/common';
import { findActiveLoadTag } from './util';
import { ValidationError } from '@core/errors';

@Injectable()
export class ChangeActionDeleteOperationHandler {
  private logger = new Logger(ChangeActionDeleteOperationHandler.name);

  constructor(
    private readonly tagDefinitionRepository: TagDefinitionRepository,
  ) {}

  async handle(changeAction: ChangeAction, load: LoadEntity, groupId: string) {
    const shouldDeleteTag = [
      ChangeSubject.Tag,
      ChangeSubject.TagActivity,
    ].includes(changeAction.properties.subject);
    const shouldDeleteActivity = [
      ChangeSubject.Activity,
      ChangeSubject.TagActivity,
    ].includes(changeAction.properties.subject);
    let tag: TagDefinitionEntity;

    if (changeAction.activityId && shouldDeleteActivity) {
      const activity = load.activities.find(
        (activity) =>
          activity.id === changeAction.activityId &&
          activity.recordStatus === RecordStatus.Active,
      );
      if (!activity) {
        this.logger.error(
          `Cannot delete activity because it does not exist on this load`,
          {
            loadId: load.id,
            activityId: changeAction.activityId,
            optional: changeAction.properties.optional,
          },
        );
        if (!changeAction.properties.optional) {
          throw new ValidationError(
            `Cannot delete activity with id ${changeAction.activityId} because it does not exist on load with id ${load.id}`,
          );
        }
        return;
      }
      activity.recordStatus = RecordStatus.Inactive;
      tag = activity.tagDefinition;
    } else {
      tag = await this.getTag(changeAction, load);
    }

    if (shouldDeleteTag) {
      const found = findActiveLoadTag(load, tag);
      if (found) {
        found.recordStatus = RecordStatus.Inactive;
        this.appendActivityLog(load, tag, groupId);
      }
      // We can have only activity entries with no tags (ie. NOTE)
      if (
        !found &&
        !shouldDeleteActivity &&
        !changeAction.properties.optional
      ) {
        this.logger.error(
          `Cannot delete tag because it does not exist on this load`,
          {
            loadId: load.id,
            tag: tag.key,
          },
        );
        throw new ValidationError(
          `Cannot delete tag ${tag.key} because it does not exist on load ${load.id}`,
        );
      }
    }
  }

  private getTag(changeAction: ChangeAction, load: LoadEntity) {
    if (!changeAction.key) {
      this.logger.error(
        'Cannot delete tag activity because no key was provided',
        {
          loadNumber: load.loadNumber,
        },
      );
      throw new ValidationError(
        'Cannot delete tag activity because no key was provided',
      );
    }
    return this.tagDefinitionRepository.getByKey(changeAction.key);
  }

  private appendActivityLog(
    load: LoadEntity,
    tag: TagDefinitionEntity,
    groupId: string,
  ): void {
    this.logger.debug('Assigning activity to load', {
      loadId: load.id,
      loadNumber: load.loadNumber,
      tag: tag.key,
    });

    const activityLog = new ActivityLogEntity();
    activityLog.tagDefinition = tag;
    activityLog.note = `Deleted tag ${tag.name}`;
    activityLog.payload = {};
    activityLog.groupId = groupId;
    activityLog.tagStatus = TagStatus.Inactive;
    load.activities.add(activityLog);
  }
}
