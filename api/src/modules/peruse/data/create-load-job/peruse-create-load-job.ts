import { PeruseJobStatus } from '@module-persistence';
import { Expose, Type } from 'class-transformer';
import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  ValidateNested,
} from 'class-validator';
import { PeruseJobType } from '../peruse-job-types';

class Document {
  @Expose({ name: 'document_ref' })
  @IsNotEmpty()
  documentRef: string;

  @Expose({ name: 'external_id' })
  @IsOptional()
  externalId?: string;
}

export class CreateLoadDocumentInput {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => Document)
  documents?: Document[];
}

export class PeruseCreateLoadJobResponse {
  @Expose({ name: 'job_id' })
  @IsNotEmpty()
  jobId: string;

  @Expose({ name: 'load_id' })
  @IsNotEmpty()
  loadId: string;

  @Expose({ name: 'status' })
  @IsEnum(PeruseJobStatus)
  status: PeruseJobStatus;

  @Expose({ name: 'job_type' })
  @IsNotEmpty()
  @IsEnum(PeruseJobType)
  jobType: PeruseJobType;

  @Expose({ name: 'input' })
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => CreateLoadDocumentInput)
  input: CreateLoadDocumentInput;

  @Expose({ name: 'message' })
  @IsOptional()
  message?: string;
}
