import { Provider } from '@nestjs/common';
import { LocalLogger } from './local-logger.service';
import { CloudLogger } from './cloud-logger.service';
import { environment } from '@core';

export const LOGGER_PROVIDER = 'LoggerService';

export const loggerProvider: Provider = {
  provide: LOGGER_PROVIDER,
  useFactory: async () => {
    if (environment.isLocal()) {
      return new LocalLogger();
    }
    return new CloudLogger();
  },
};
