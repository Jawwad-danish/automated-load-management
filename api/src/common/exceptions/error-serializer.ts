import { AxiosError, isAxiosError } from 'axios';
import { AppInvalidInputException } from './invalid-input.exception';

function axiosErrorSerializer(error: AxiosError) {
  return {
    name: error.name,
    message: error.message,
    stack: error.stack,
    status: error.status,
    code: error.code,
    request: {
      method: error.config?.method,
      url: [error.config?.baseURL, error.config?.url]
        .filter((part) => part)
        .join(''),
    },
    response: {
      status: error.response?.status,
      data: error.response?.data,
    },
    cause: errorSerializer(error.cause),
  };
}

export function errorSerializer(error: unknown) {
  try {
    if (!(error instanceof Error)) {
      return error;
    }

    if (isAxiosError(error)) {
      return axiosErrorSerializer(error);
    }

    if ('toJSON' in error && typeof error.toJSON === 'function') {
      return {
        ...error.toJSON(),
        cause: errorSerializer(error.cause),
        validationErrors:
          error instanceof AppInvalidInputException
            ? error.validationErrors.map((validationError) =>
                errorSerializer(validationError),
              )
            : undefined,
      };
    }

    const serialized = {
      name: error.name,
      message: error.message,
      stack: error.stack,
      cause: errorSerializer(error.cause),
    };

    for (const key in error) {
      if (serialized[key] === undefined) {
        const value = error[key];
        if (value instanceof Error) {
          serialized[key] = errorSerializer(value);
        } else if (Array.isArray(value)) {
          serialized[key] = value.map((el) => errorSerializer(el));
        } else {
          serialized[key] = value;
        }
      }
    }

    return serialized;
  } catch (e) {
    // failsafe. should never get here
    return {
      name: e.name,
      message: e.message,
    };
  }
}
