import { AppException, AppExceptionOptions } from './app.exception';
import { ValidationError } from 'class-validator';
import { HttpStatus } from '@nestjs/common';

export type AppInvalidInputExceptionOptions = AppExceptionOptions & {
  validationErrors?: ValidationError[];
};

export enum AppInvalidInputExceptionCodes {
  DEFAULT = 111,
}

export class AppInvalidInputException extends AppException {
  name = AppInvalidInputException.name;
  code = AppInvalidInputExceptionCodes.DEFAULT;
  statusCode = HttpStatus.BAD_REQUEST;

  validationErrors: ValidationError[] = [];

  constructor({
    validationErrors,
    message = 'Invalid input provided',
    ...options
  }: AppInvalidInputExceptionOptions) {
    super({
      message,
      ...options,
    });
    this.setValidationErrors(validationErrors);
  }

  setValidationErrors(validationErrors: ValidationError[]) {
    this.validationErrors = validationErrors;
    return this;
  }

  static fromValidationErrors(
    errors: ValidationError[],
  ): AppInvalidInputException {
    return new AppInvalidInputException({ validationErrors: errors });
  }
}
