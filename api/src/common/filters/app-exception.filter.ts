import { AppContextHolder } from '@core/context';
import { environment } from '@core/environment';
import { CauseAwareError, Reason } from '@core/errors';
import { DriverException } from '@mikro-orm/core';
import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  ForbiddenException,
  HttpException,
  HttpStatus,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import * as Sentry from '@sentry/node';
import { ValidationError } from 'class-validator';
import { Response } from 'express';
import { AppInvalidInputException } from '../exceptions';
import { AppExceptionModel } from '../models/app-exception.model';

@Catch(Error)
export class AppExceptionFilter implements ExceptionFilter {
  private readonly logger: Logger = new Logger(AppExceptionFilter.name);

  catch(exception: Error, host: ArgumentsHost) {
    if (!(exception instanceof NotFoundException)) {
      this.logger.error(exception);
    }
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const payload = new AppExceptionModel({
      traceId: AppContextHolder.get().correlationId,
      timestamp: new Date().toISOString(),
      statusCode: this.getStatusCode(exception),
      error: exception.name,
      message: this.getErrorMessage(exception),
      parameters:
        exception instanceof AppInvalidInputException
          ? this.formatValidationErrors(exception.validationErrors)
          : undefined,
      stackTrace: this.getStackTrace(exception),
    });

    response.status(payload.statusCode).json(payload);

    if (
      exception instanceof ForbiddenException ||
      exception instanceof UnauthorizedException
    ) {
      try {
        Sentry.captureException(payload);
      } catch (error) {
        this.logger.error('Failed sending exception to Sentry', error);
      }
    }
  }

  private getErrorMessage(exception: Error) {
    if (exception instanceof DriverException) {
      return 'An unexpected internal error occurred.';
    }
    return exception.message;
  }

  private formatValidationErrors(
    errors: ValidationError[] = [],
    parents: string[] = [],
  ) {
    return errors
      .map(({ property, constraints, children }) => {
        if (children && children.length > 0) {
          return this.formatValidationErrors(children, [...parents, property]);
        }
        return {
          name: [...parents, property].join('.'),
          message: Object.values(constraints).join(','),
        };
      })
      .flat(4);
  }

  private getStatusCode(exception: Error): number {
    if (exception instanceof HttpException) {
      return exception.getStatus();
    }
    if (exception instanceof CauseAwareError) {
      const reason = exception.getReason();
      switch (reason) {
        case Reason.Validation:
          return HttpStatus.BAD_REQUEST;
        case Reason.ExternalServiceCall:
          return HttpStatus.SERVICE_UNAVAILABLE;
        case Reason.Missing:
          return HttpStatus.NOT_FOUND;
        case Reason.Unknown:
        default:
          return HttpStatus.INTERNAL_SERVER_ERROR;
      }
    }
    if ('statusCode' in exception) {
      return exception.statusCode as number;
    }
    return HttpStatus.INTERNAL_SERVER_ERROR;
  }

  private getStackTrace(exception: Error) {
    if (environment.isProduction()) {
      return undefined;
    }
    return {
      stack: exception.stack,
      cause:
        exception.cause instanceof Error
          ? this.getStackTrace(exception.cause)
          : undefined,
    };
  }
}
