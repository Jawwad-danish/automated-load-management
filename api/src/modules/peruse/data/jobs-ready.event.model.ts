import { BaseModel } from '@core/data';

export class CreateLoadJobsReadyEvent extends BaseModel<CreateLoadJobsReadyEvent> {
  jobIds: string[];
}

export class ClassificationJobsReadyEvent extends BaseModel<ClassificationJobsReadyEvent> {
  jobIds: string[];
}
