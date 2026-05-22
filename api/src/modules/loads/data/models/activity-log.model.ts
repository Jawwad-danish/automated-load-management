import { AuditBaseModel } from '@core/data';
import { TagStatus, UsedByType } from '@module-persistence/entities';
import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { TagDefinition } from '@module-tag-definitions';

export class ActivityLog extends AuditBaseModel<ActivityLog> {
  @Expose()
  @ApiProperty({
    title: 'Activity log ID',
    description: 'The activity log ID',
    format: 'uuid',
  })
  id: string;

  @Expose()
  @ApiProperty({
    title: 'Activity log group ID',
    description:
      'The activity log group ID. Used to group multiple entries done by a single action.',
    format: 'uuid',
  })
  groupId: string;

  @Expose()
  @ApiProperty({
    title: 'Activity log tag definition',
    description:
      'Defines the type of activity log. For example an invoice update.',
  })
  tagDefinition: TagDefinition;

  @Expose()
  @ApiProperty({
    title: 'Activity log tag status',
    description: 'Represents the removal or addition of a tag',
  })
  tagStatus: TagStatus;

  @Expose()
  @ApiProperty({
    title: 'Activity log note',
    description: 'The activity log entry note.',
  })
  note: string;

  @Expose()
  @ApiProperty({
    title: 'Activity log assignedBy',
    description: 'The activity log entry assigner.',
  })
  assignedBy: UsedByType;

  @Expose()
  @ApiProperty({
    title: 'Activity log payload',
    description: 'The activity log payload.',
    type: 'object',
  })
  payload: object;
}
