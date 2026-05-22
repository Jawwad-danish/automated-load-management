export enum RecordStatus {
  Active = 'Active',
  Inactive = 'Inactive',
}

export abstract class PrimitiveEntity {
  id: string | number;
  createdAt: Date;
  updatedAt: Date;
  recordStatus: RecordStatus;
}
