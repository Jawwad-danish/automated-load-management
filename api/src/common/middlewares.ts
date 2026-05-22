import { AppExceptionFilter, AppInvalidInputException } from '@common';
import { AppContextHolder } from '@core/context';
import { environment } from '@core/environment';
import { RequestContext } from '@mikro-orm/core';
import { DatabaseService } from '@module-database';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { Request, Response } from 'express';

export function enableCors(app: INestApplication) {
  app.enableCors({
    origin: environment.core.origins(),
  });
}

export function enableValidationPipes(app: INestApplication) {
  app.useGlobalPipes(
    new ValidationPipe({
      stopAtFirstError: true,
      transform: true,
      whitelist: true,
      transformOptions: {
        excludeExtraneousValues: false,
        exposeDefaultValues: true,
      },
      exceptionFactory: AppInvalidInputException.fromValidationErrors,
    }),
  );
}

export function enableRequestContextHelper(app: INestApplication) {
  const databaseService = app.get<DatabaseService>(DatabaseService);
  app.use((_req: Request, _res: Response, next: (...args: any[]) => void) => {
    RequestContext.create(databaseService.getMikroORM().em, next);
  });
  app.use((req: Request, _res: Response, next: (...args: any[]) => void) => {
    AppContextHolder.create(req, next);
  });
}

export function configureSwagger(app: INestApplication) {
  if (environment.isProduction()) {
    return;
  }
  const config = new DocumentBuilder()
    .setTitle('Load Management Developer Docs')
    .setDescription(
      `
    Welcome to the Load Management Developer Docs!

    Step 1: Obtain your auth0 token
    Load Management Service authenticates your API requests using your unique auth0 token.
    If you do not include your auth0 token when making an API request or use one that is incorrect , Load Management Service will return an error.

    Step 2: Make an API request
    To check that your integration is working correctly, you can make an API request using your auth0 token
    `,
    )
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'Bearer',
        bearerFormat: 'JWT',
        in: 'header',
      },
      'token',
    )
    .addSecurityRequirements('token')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  });
}

export function enableExceptionsFilters(app: INestApplication) {
  app.useGlobalFilters(new AppExceptionFilter());
}
