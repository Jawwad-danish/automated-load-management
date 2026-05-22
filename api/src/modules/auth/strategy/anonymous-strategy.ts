import { AppContextHolder, Authentication } from '@core/context';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { Strategy, VerifiedCallback } from 'passport-custom';

export class AnonymousStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor() {
    super((_req: Request, callback: VerifiedCallback) => {
      this.load()
        .then((authentication) => callback(null, authentication))
        .catch((error) => callback(error));
    });
  }

  private async load() {
    const authentication = Authentication.getSystem();
    AppContextHolder.get().setAuthentication(authentication);
    return authentication;
  }
}
