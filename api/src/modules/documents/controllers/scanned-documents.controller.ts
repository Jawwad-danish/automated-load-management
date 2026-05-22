import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { DocumentService } from '../services';
import { Public } from '@module-auth';
import { UploadScannedDocumentRequest } from '@module-documents/data';

@ApiTags('scanned-document')
@Controller('scanned-document')
export class ScannedDocumentsController {
  constructor(private readonly documentsService: DocumentService) {}

  @ApiOperation({
    description: 'Upload scanned document',
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
  })
  @Post()
  @Public()
  @HttpCode(HttpStatus.CREATED)
  async uploadScannedDocument(
    @Body() request: UploadScannedDocumentRequest,
  ): Promise<void> {
    await this.documentsService.uploadScannedDocument(request);
  }
}
