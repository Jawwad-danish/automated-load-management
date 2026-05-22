import { checkAndGetForEnvVariable } from './util';

export const nodeEnv = (): string => {
  return checkAndGetForEnvVariable('NODE_ENV');
};

export const origins = (): string[] => {
  const origins = checkAndGetForEnvVariable('ORIGINS');
  return origins.split(',');
};

export const systemId = (): string => {
  return checkAndGetForEnvVariable('SYSTEM_ID');
};

export const logLevel = (): string => {
  return checkAndGetForEnvVariable('LOG_LEVEL');
};
