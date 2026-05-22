import { RecordStatus } from '@module-persistence/entities';
import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsDateString, IsEnum } from 'class-validator';
import { BaseModel } from './base.model';

export abstract class AuditBaseModel<T> extends BaseModel<T> {
  @IsDateString()
  @Expose()
  @ApiProperty({
    title: 'Created at',
    description: 'When this entry was created',
  })
  createdAt: Date;

  @IsDateString()
  @Expose()
  @ApiProperty({
    title: 'Updated at',
    description: 'When was this entry last updated',
  })
  updatedAt: Date;

  @IsEnum(RecordStatus)
  recordStatus: RecordStatus;
}
