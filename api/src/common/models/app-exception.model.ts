import { BaseModel } from '@core/data';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

type AppExceptionStackTrace = {
  stack: string;
  cause?: AppExceptionStackTrace;
};

export class AppExceptionModel extends BaseModel<AppExceptionModel> {
  @ApiProperty({
    description: 'Trace id (received on x-correlation-id header or generated)',
    format: 'uuid',
    example: 'f0819456-1a73-4a2b-9c3e-d988d69fe341',
  })
  traceId: string;

  @ApiProperty({
    description: 'Timestamp of the error',
    format: 'date',
    example: '2024-01-04T16:43:05.938Z',
  })
  timestamp: string;

  @ApiProperty({
    description: 'Error code',
    format: 'number',
    example: 111,
  })
  code: number;

  @ApiProperty({
    description: 'Http status code',
    format: 'number',
    example: 400,
  })
  statusCode: number;

  @ApiProperty({
    description: 'Error name',
    format: 'string',
    example: 'AppInvalidInputException',
  })
  error: string;

  @ApiProperty({
    description: 'Error message',
    format: 'string',
    example: 'Invalid input provided',
  })
  message: string;

  @ApiPropertyOptional({
    description: 'The invalid parameters for AppInvalidInputException',
    format: 'object',
    isArray: true,
    example: [
      {
        name: 'phoneNumber',
        message: 'required phone number',
      },
    ],
  })
  parameters?: object;

  stackTrace?: AppExceptionStackTrace;
}
