import { AppException, AppExceptionOptions } from './app.exception';
import { HttpStatus } from '@nestjs/common';

export class AppHttpRequestException extends AppException {
  name = AppHttpRequestException.name;
  statusCode = HttpStatus.BAD_GATEWAY;

  constructor({
    message = 'An unexpected error occurred',
    ...options
  }: AppExceptionOptions = {}) {
    super({
      message,
      ...options,
    });
  }
}
