import {
  Injectable,
  CanActivate,
  ExecutionContext,
  Logger,
} from '@nestjs/common';
import { Request } from 'express';

@Injectable()
export class IpWhitelistGuard implements CanActivate {
  private readonly logger = new Logger(IpWhitelistGuard.name);

  constructor(private readonly allowedIps: string[]) {}

  canActivate(context: ExecutionContext): boolean {
    const request: Request = context.switchToHttp().getRequest();
    const xForwardedFor = (request.headers['x-forwarded-for'] ||
      request.headers['X-Forwarded-For']) as string;

    const clientIp = xForwardedFor
      ? xForwardedFor.split(',')[0].trim()
      : request.ip;

    const normalizedIp = clientIp.startsWith('::ffff:')
      ? clientIp.substring(7)
      : clientIp;

    const canActivate = this.allowedIps.includes(normalizedIp);
    if (!canActivate) {
      this.logger.error(
        `IP ${normalizedIp} is not included in whitelisted IPs ${this.allowedIps}`,
      );
    }
    return canActivate;
  }
}
