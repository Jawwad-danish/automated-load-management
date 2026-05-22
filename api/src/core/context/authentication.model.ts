import { checkAndGetForEnvVariable } from '../environment/util';

export class Principal {
  constructor(
    readonly id: string,
    readonly email: string,
  ) {}
}

export class Authority {
  constructor(readonly permissions: string[]) {}
}

export class Authentication {
  constructor(
    readonly principal: Principal,
    readonly authority: Authority,
  ) {}

  static getSystem() {
    const id = checkAndGetForEnvVariable('SYSTEM_ID');
    const email = checkAndGetForEnvVariable('SYSTEM_EMAIL');
    return new Authentication(new Principal(id, email), new Authority(['*']));
  }
}
