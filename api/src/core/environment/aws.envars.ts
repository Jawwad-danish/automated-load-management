export const defaultRegion = (): string => {
  if (!process.env.AWS_DEFAULT_REGION) {
    return 'us-east-1';
  }
  return process.env.AWS_DEFAULT_REGION;
};
