import { ChangeAction, ChangeActor, ChangeSubject } from '@common';
import { Note } from '@core/data';
import {
  ActivityLogEntity,
  LoadEntity,
  LoadTagEntity,
  TagDefinitionEntity,
  TagDefinitionKey,
  TagDefinitionRepository,
  UsedByType,
} from '@module-persistence';
import { Injectable, Logger } from '@nestjs/common';
import { loadContainsActiveTag } from './util';
import { ValidationError } from '@core';

export enum AssignmentAction {
  None = 'none',
  OnlyActivity = 'only-activity',
  TagAndActivity = 'tag-activity',
}

@Injectable()
export class ChangeActionAssignOperationHandler {
  private logger = new Logger(ChangeActionAssignOperationHandler.name);

  constructor(
    private readonly tagDefinitionRepository: TagDefinitionRepository,
  ) {}

  async handle(changeAction: ChangeAction, load: LoadEntity, groupId: string) {
    const tag = await this.getTag(changeAction, load);
    const shouldAssignTag = [
      ChangeSubject.Tag,
      ChangeSubject.TagActivity,
    ].includes(changeAction.properties.subject);

    const shouldAssignActivity = [
      ChangeSubject.Activity,
      ChangeSubject.TagActivity,
    ].includes(changeAction.properties.subject);
    const assignmentAction = shouldAssignTag
      ? await this.getAssignmentAction(load, tag, changeAction)
      : shouldAssignActivity
        ? AssignmentAction.OnlyActivity
        : AssignmentAction.None;

    if (
      shouldAssignTag &&
      assignmentAction === AssignmentAction.TagAndActivity
    ) {
      this.appendTag(load, tag, changeAction.properties.actor);
    }

    if (shouldAssignActivity && assignmentAction !== AssignmentAction.None) {
      if (!changeAction.noteDetails) {
        this.logger.error(
          'Cannot assign tag activity because no note details were provided',
          {
            loadId: load.id,
            loadNumber: load.loadNumber,
            tag: tag.key,
          },
        );
        throw new ValidationError(
          `Cannot assign tag ${tag.key} activity to load ${load.id} because no note details were provided`,
        );
      }
      this.appendActivityLog(
        load,
        tag,
        changeAction.noteDetails,
        groupId,
        changeAction.activityId,
      );
    }
  }

  private getTag(changeAction: ChangeAction, load: LoadEntity) {
    if (!changeAction.key) {
      this.logger.error(
        'Cannot assign tag activity because no key was provided',
        {
          loadNumber: load.loadNumber,
        },
      );
      throw new ValidationError(
        `Cannot assign tag activity on load ${load.id} because no key was provided`,
      );
    }
    return this.tagDefinitionRepository.getByKey(changeAction.key);
  }

  private async getAssignmentAction(
    load: LoadEntity,
    tag: TagDefinitionEntity,
    changeAction: ChangeAction,
  ): Promise<AssignmentAction> {
    if (tag.key === TagDefinitionKey.NOTE) {
      return AssignmentAction.OnlyActivity;
    }

    if (loadContainsActiveTag(load, tag)) {
      if (changeAction.properties.optional) {
        this.logger.warn(
          'Load is already tagged and the assignment is skipped because it is optional',
          {
            loadId: load.id,
            tag: tag.key,
          },
        );
        return AssignmentAction.None;
      }

      this.logger.error(`Load already contains tag. Cannot reassign`, {
        loadId: load.id,
        tag: tag.key,
      });
      throw new ValidationError(
        `Load ${load.id} already contains tag ${tag.key}`,
      );
    }

    try {
      return AssignmentAction.TagAndActivity;
    } catch (error) {
      this.logger.error(
        'Assignment action set to none because validation failed',
        {
          error: error.message,
          loadId: load.id,
          tag: tag.key,
        },
      );
      return AssignmentAction.None;
    }
  }

  private appendTag(
    load: LoadEntity,
    tag: TagDefinitionEntity,
    actor: ChangeActor,
  ): void {
    this.logger.debug('Assigning tag to load', {
      loadId: load.id,
      loadNumber: load.loadNumber,
      tag: tag.key,
    });

    const loadTagActivity = new LoadTagEntity();
    loadTagActivity.load = load;
    loadTagActivity.tagDefinition = tag;
    loadTagActivity.assignedByType =
      actor === ChangeActor.System ? UsedByType.System : UsedByType.User;
    load.tags.add(loadTagActivity);
  }

  private appendActivityLog(
    load: LoadEntity,
    tag: TagDefinitionEntity,
    noteDetails: Note,
    groupId: string,
    activityId: null | string,
  ): void {
    this.logger.debug('Assigning activity to load', {
      loadId: load.id,
      loadNumber: load.loadNumber,
      tag: tag.key,
    });

    const activityLog = new ActivityLogEntity();
    if (activityId) {
      activityLog.id = activityId;
    }
    activityLog.tagDefinition = tag;
    activityLog.note = this.buildNote(tag, noteDetails);
    activityLog.payload = noteDetails.payload;
    activityLog.groupId = groupId;
    load.activities.add(activityLog);
  }

  private buildNote(tag: TagDefinitionEntity, noteDetails: Note): string {
    if (noteDetails.hasText()) {
      return noteDetails.getText();
    }

    if (tag.notePlaceholders) {
      const note = noteDetails.getPlaceholderAwareNote(
        tag.note,
        tag.notePlaceholders,
      );
      return Note.systemMessage(note);
    }

    return Note.systemMessage(tag.note);
  }
}
