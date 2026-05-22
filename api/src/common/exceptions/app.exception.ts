import { HttpStatus } from '@nestjs/common';

export type AppExceptionOptions = {
  message?: string;
  code?: number;
  cause?: Error;
  metadata?: Record<string, any>;
};

export class AppException extends Error {
  name = AppException.name;
  statusCode = HttpStatus.INTERNAL_SERVER_ERROR;

  metadata: Record<string, any> = {};

  constructor({
    message = '',
    cause = null,
    metadata = {},
  }: AppExceptionOptions) {
    super(message, { cause });

    if (metadata) {
      this.setMetadata(metadata);
    }
  }

  setMetadata(metadata: Record<string, any>) {
    Object.assign(this.metadata, metadata);
    return this;
  }

  toJSON() {
    return {
      name: this.name,
      statusCode: this.statusCode,
      metadata: this.metadata,
      message: this.message,
      stack: this.stack,
    };
  }
}

export class AppEntityNotFoundException extends AppException {
  name = AppEntityNotFoundException.name;
  statusCode = HttpStatus.NOT_FOUND;
}

export class AppEntityAlreadyExistsException extends AppException {
  name = AppEntityAlreadyExistsException.name;
  statusCode = HttpStatus.CONFLICT;
}
