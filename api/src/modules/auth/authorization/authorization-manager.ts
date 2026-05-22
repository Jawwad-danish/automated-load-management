import { Authentication } from '@core/context';
import { Injectable } from '@nestjs/common';
import { Permissions } from './permissions';

@Injectable()
export class AuthorizationManager {
  hasRequiredPermissions(
    user: Authentication,
    requiredPermissions: string[],
  ): boolean {
    if (this.isSuperUser(user)) {
      return true;
    }
    return requiredPermissions.every((permission) =>
      user.authority.permissions.includes(permission),
    );
  }

  private isSuperUser(user: Authentication): boolean {
    return user.authority.permissions.includes(Permissions.SuperUser);
  }
}
