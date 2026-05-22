import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { DriverLoad } from '../data/models';
import { LoadsService } from '../services';
import { Public } from '@module-auth';
import { DriverLoadMapper } from '../data/mappers';

@ApiTags('driver-load')
@ApiResponse({
  status: '4XX',
})
@Controller('driver-load')
export class DriverLoadController {
  constructor(
    private loadsService: LoadsService,
    private driverLoadMapper: DriverLoadMapper,
  ) {}

  @ApiOperation({
    description: 'Get driver load',
  })
  @ApiResponse({
    status: HttpStatus.OK,
  })
  @HttpCode(HttpStatus.OK)
  @Public()
  @Get('/:requestId')
  async getDriverLoad(
    @Param('requestId', ParseUUIDPipe) requestId: string,
  ): Promise<DriverLoad> {
    const load = await this.loadsService.getDriverLoad(requestId);
    return await this.driverLoadMapper.entityToModel(load);
  }
}
