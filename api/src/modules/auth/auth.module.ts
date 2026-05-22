import { AWSModule } from '@module-aws';
import { BobtailConfigModule } from '@module-config';
import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { PassportModule } from '@nestjs/passport';
import { Auth0CredentialsService } from './credentials';
import { JwtAuthGuard, PermissionsGuard } from './guards';
import { strategyProvider } from './strategy';
import { AuthorizationManager } from './authorization';
import { m2MTokenServiceProvider } from './token';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    AWSModule,
    BobtailConfigModule,
  ],
  providers: [
    Auth0CredentialsService,
    strategyProvider,
    m2MTokenServiceProvider,
    AuthorizationManager,
    JwtAuthGuard,
    PermissionsGuard,
    {
      provide: APP_GUARD,
      useExisting: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useExisting: PermissionsGuard,
    },
  ],
  exports: [PassportModule, m2MTokenServiceProvider],
})
export class AuthModule {}
