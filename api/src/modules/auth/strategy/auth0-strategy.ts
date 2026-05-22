import {
  AppContextHolder,
  Authentication,
  Authority,
  Principal,
} from '@core/context';
import { ForbiddenException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { passportJwtSecret } from 'jwks-rsa';
import { ExtractJwt, Strategy as JWTStrategy } from 'passport-jwt';
import { Auth0Credentials } from '../credentials';
import { JWTPayload } from './jwt-payload';

export class Auth0Strategy extends PassportStrategy(JWTStrategy, 'jwt') {
  constructor(credentials: Auth0Credentials) {
    super({
      secretOrKeyProvider: passportJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        jwksUri: `https://${credentials.domain}/.well-known/jwks.json`,
      }),
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      audience: credentials.audience,
      issuer: `https://${credentials.domain}/`,
      algorithms: ['RS256'],
    });
  }

  async validate(payload: JWTPayload): Promise<Authentication> {
    if (!payload.email) {
      if (payload.gty === 'client-credentials') {
        payload.email = 'system@bobtail.com';
      } else {
        throw new ForbiddenException('Missing email from JWT Token');
      }
    }
    const authentication = new Authentication(
      new Principal(payload.sub, payload.email),
      new Authority(payload.permissions),
    );
    AppContextHolder.get().setAuthentication(authentication);
    return authentication;
  }
}
