import { Arrays } from '@core/util';
import {
  Body,
  Controller,
  Delete,
  HttpCode,
  HttpStatus,
  Param,
  ParseArrayPipe,
  ParseUUIDPipe,
  Post,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { DocumentService } from '../services';
import {
  Document,
  DocumentMapper,
  UploadDocumentRequest,
} from '@module-documents/data';

@ApiTags('documents')
@Controller('clients/:clientId/loads/:loadId/documents')
export class DocumentsController {
  constructor(
    private readonly documentsService: DocumentService,
    private readonly documentsMapper: DocumentMapper,
  ) {}

  @ApiOperation({
    description: 'Get all documets',
  })
  @ApiResponse({
    status: HttpStatus.OK,
  })
  @Delete(':documentId')
  @HttpCode(HttpStatus.OK)
  async delete(
    @Param('clientId', ParseUUIDPipe) clientId: string,
    @Param('loadId', ParseUUIDPipe) loadId: string,
    @Param('documentId', ParseUUIDPipe) documentId: string,
  ): Promise<void> {
    await this.documentsService.delete(clientId, loadId, documentId);
  }

  @ApiOperation({
    description: 'Get all documets',
  })
  @ApiResponse({
    status: HttpStatus.OK,
  })
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async upload(
    @Param('clientId', ParseUUIDPipe) clientId: string,
    @Param('loadId', ParseUUIDPipe) loadId: string,
    @Body(new ParseArrayPipe({ items: UploadDocumentRequest }))
    request: UploadDocumentRequest[],
  ): Promise<Document[]> {
    const documents = await this.documentsService.upload(
      clientId,
      loadId,
      request,
    );
    return await Arrays.mapAsync(documents, (item) =>
      this.documentsMapper.entityToModel(item),
    );
  }
}
