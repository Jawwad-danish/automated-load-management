import * as core from './core.envars';
import * as aws from './aws.envars';
import * as environments from './environments';

export const environment = {
  aws,
  core,
  ...environments,
};
