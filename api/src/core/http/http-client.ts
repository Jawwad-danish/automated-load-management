import { AppContextHolder } from '@core/context';
import { ErrorFactory } from '@core/errors';
import { Observability } from '@core/observability';
import { AuthTokenService } from '@module-auth';
import { BadRequestException, HttpException, Logger } from '@nestjs/common';
import axios, { AxiosError, AxiosHeaderValue, AxiosHeaders } from 'axios';
import { instanceToPlain, plainToInstance } from 'class-transformer';
import { ValidationError, validateOrReject } from 'class-validator';
import { isObject } from 'lodash';
import {
  ClientOptions,
  DeleteOptions,
  GetOptions,
  PostOptions,
  ResponseOptions,
} from './http-client-options';

export class HttpClient {
  private logger: Logger = new Logger(HttpClient.name);

  constructor(
    public name: string,
    private readonly authTokenService: AuthTokenService,
  ) {}

  delete<T>(url: string, options?: DeleteOptions<T>): Promise<null | number> {
    this.logger.log(`DELETE ${url}`);

    return this.runHandled(async () => {
      const headers = await this.buildHeaders(options?.request.headers);
      return await axios.delete(url, {
        headers,
      });
    }, options);
  }

  get<T>(url: string, options: GetOptions<T>): Promise<null | T | T[]> {
    return this.runHandled(async () => {
      this.logger.log(`GET ${url}`);

      const headers = await this.buildHeaders(options.request?.headers);
      const params = options.request?.queryParams || {};
      const response = await axios.get(url, {
        headers,
        params,
        data: options.request?.body,
      });
      return this.getResponseBody(response.data, options.response);
    }, options);
  }

  post<T>(url: string, options: PostOptions<T>): Promise<T | null> {
    return this.runHandled(async () => {
      this.logger.log(`POST ${url}`);

      const headers = await this.buildHeaders(options.request?.headers);
      let payload: any = options.request?.body || {};
      if (options.request?.validate) {
        await validateOrReject(payload);
      }
      if (options.request?.toPlainObject) {
        payload = instanceToPlain(payload);
      }
      const response = await axios.post(url, payload, {
        headers,
      });
      return await this.getResponseBody(response, options.response);
    }, options);
  }

  put<T>(url: string, options: PostOptions<T>): Promise<T | null> {
    return this.runHandled(async () => {
      this.logger.log(`POST ${url}`);

      const headers = await this.buildHeaders(options.request?.headers);
      let payload: any = options.request?.body || {};
      if (options.request?.validate) {
        await validateOrReject(payload);
      }
      if (options.request?.toPlainObject) {
        payload = instanceToPlain(payload);
      }
      const response = await axios.put(url, payload, {
        headers,
      });
      return await this.getResponseBody(response, options.response);
    }, options);
  }

  private async getResponseBody<T>(
    data: any,
    options: ResponseOptions<T>,
  ): Promise<null | T> {
    let responseBody: null | T = null;
    if (options.mapper) {
      responseBody = options.mapper(data);
    }
    if (options.asyncMapper) {
      responseBody = await options.asyncMapper(data);
    }
    const items: T | T[] = data.items ?? data;
    if (options.bodyType) {
      if (data === '') {
        return null;
      }
      responseBody = plainToInstance(options.bodyType, items, {
        excludeExtraneousValues: true,
        exposeDefaultValues: true,
      });
    }
    if (responseBody !== null) {
      if (options.bodyType) {
        if (
          !Array.isArray(responseBody) &&
          !(responseBody instanceof options.bodyType)
        ) {
          throw ErrorFactory.validateType(options.bodyType, items);
        }
      }

      if (options.validateBody && isObject(responseBody)) {
        await validateOrReject(responseBody as object);
      }
    }
    return responseBody;
  }

  private async runHandled<T>(
    callback: () => Promise<T>,
    options?: ClientOptions,
  ): Promise<null | T> {
    try {
      return await callback();
    } catch (error) {
      Observability.setTag('bobtail_external_api', this.name);
      if (!options?.nullOnFail) {
        throw this.asHttpException(error);
      }
      return null;
    }
  }

  private asHttpException(error: Error): HttpException {
    if (error instanceof AxiosError) {
      if (error.response) {
        const errorMessage = error.response?.data?.message
          ? error.response.data.message
          : error.message;
        this.logger.error(
          `Method: ${error.config?.method} Url: ${error.config?.url} Message: ${errorMessage}`,
        );
        return new HttpException(errorMessage, error.response.status);
      }
    }
    if (error instanceof HttpException) {
      return error;
    }
    const errors = error instanceof ValidationError ? [error] : error;
    if (Array.isArray(errors)) {
      const constraints = errors
        .filter((e) => e instanceof ValidationError)
        .map((e) => (e as ValidationError).constraints || {})
        .map((e) => Object.values(e))
        .reduce((previous, current) => previous.concat(current), []);
      return new BadRequestException(constraints);
    }
    return this.somethingWentWrongException();
  }

  private somethingWentWrongException(): HttpException {
    return new HttpException('Something went wrong', 500);
  }

  private async buildHeaders(rawHeaders?: {
    [header: string]: AxiosHeaderValue;
  }): Promise<AxiosHeaders> {
    const headers = new AxiosHeaders(rawHeaders);
    const context = AppContextHolder.get();
    headers.set('x-correlation-id', context.correlationId);
    let token = await this.authTokenService.getAccessToken();
    if (token) {
      if (!token.startsWith('Bearer ')) {
        token = `Bearer ${token}`;
      }
      headers.setAuthorization(token);
    }
    headers.set('agent', context.agent);
    return headers;
  }
}
