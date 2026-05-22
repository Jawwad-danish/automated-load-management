import { AuditBaseModel } from '@core/data';
import {
  TagDefinitionKey,
  TagDefinitionLevel,
  TagDefinitionVisibility,
  UsedByType,
} from '@module-persistence/entities';
import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose, Type } from 'class-transformer';
import { IsOptional, IsString, IsUUID } from 'class-validator';

export class TagDefinition extends AuditBaseModel<TagDefinition> {
  @IsUUID()
  @IsOptional()
  @Expose()
  @ApiProperty({
    title: 'Tag ID',
    description: 'The tag ID',
    format: 'uuid',
  })
  id?: string;

  @IsString()
  @Expose()
  @ApiProperty({
    title: 'Tag name',
    description: 'The tag name',
  })
  name: string;

  @Type(() => String)
  @ApiProperty({
    title: 'Tag key',
    description: 'The tag key used to identify a tag',
    enum: TagDefinitionKey,
  })
  key: TagDefinitionKey;

  @Type(() => String)
  @Expose()
  @ApiProperty({
    title: 'Tag level',
    description: 'The tag level used to indicate what type of tag it is',
    enum: TagDefinitionLevel,
  })
  level: TagDefinitionLevel;

  @Expose()
  @ApiProperty({
    title: 'Tag assignedByType',
    description:
      'The tag assignedByType used to indicate the attributor of the tag',
    enum: UsedByType,
  })
  assignedByType: UsedByType;

  @Type(() => String)
  @Exclude()
  @ApiProperty({
    title: 'Tag visibility',
    description: 'The tag visibility used to indicate who can view this tag',
    enum: TagDefinitionLevel,
  })
  visibility: TagDefinitionVisibility;
}
