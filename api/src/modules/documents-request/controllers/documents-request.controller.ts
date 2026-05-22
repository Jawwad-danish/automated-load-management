import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Post,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import {
  DocumentsRequestMapper,
  DriverDataRequest,
  DocumentRequest,
} from '../data';
import { DocumentsRequestService } from '../services';

@ApiTags('documents-request')
@Controller('/clients/:clientId/loads/:loadId/documents-request')
export class DocumentsRequestController {
  constructor(
    private readonly documentsRequestService: DocumentsRequestService,
    private readonly mapper: DocumentsRequestMapper,
  ) {}

  @Post()
  @ApiOperation({
    description: 'Request document',
  })
  @ApiResponse({
    status: HttpStatus.OK,
  })
  @HttpCode(200)
  async requestDocument(
    @Param('clientId', ParseUUIDPipe) clientId: string,
    @Param('loadId', ParseUUIDPipe) loadId: string,
    @Body() driverId: DriverDataRequest,
  ): Promise<DocumentRequest> {
    const documentRequest = await this.documentsRequestService.sendRequest(
      clientId,
      loadId,
      driverId.driverId,
    );
    return this.mapper.entityToModel(documentRequest);
  }
}
