import { Criteria, QueryCriteria } from '@core/data';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { PageResult } from 'src/core/data/pagination';
import { Load, LoadsStats } from '../data/models';
import { LoadsService } from '../services';
import { FactorLoadRequest, LoadMapper, UpdateLoadRequest } from '../data';

@ApiTags('loads')
@ApiResponse({
  status: '4XX',
})
@Controller('clients/:clientId/loads')
export class LoadsController {
  constructor(
    private loadsService: LoadsService,
    private loadMapper: LoadMapper,
  ) {}

  @ApiBearerAuth()
  @ApiOperation({
    description: 'Get all loads',
  })
  @ApiResponse({
    status: HttpStatus.OK,
  })
  @HttpCode(HttpStatus.OK)
  @Get()
  async findAll(
    @Param('clientId', ParseUUIDPipe) clientId: string,
    @Criteria({
      parseFilterValues: true,
    })
    criteria: QueryCriteria,
  ): Promise<PageResult<Load>> {
    return this.loadsService.findAll(clientId, criteria);
  }

  @ApiBearerAuth()
  @ApiOperation({
    description: 'Get loads stats',
  })
  @ApiResponse({
    status: HttpStatus.OK,
  })
  @HttpCode(HttpStatus.OK)
  @Get('stats')
  loadsStats(
    @Param('clientId', ParseUUIDPipe) clientId: string,
  ): Promise<LoadsStats> {
    return this.loadsService.loadsStats(clientId);
  }

  @ApiOperation({
    description: 'Delete load',
  })
  @ApiResponse({
    status: HttpStatus.OK,
  })
  @Delete(':loadId')
  @HttpCode(HttpStatus.OK)
  async delete(
    @Param('clientId', ParseUUIDPipe) clientId: string,
    @Param('loadId', ParseUUIDPipe) loadId: string,
  ): Promise<void> {
    await this.loadsService.delete(clientId, loadId);
  }

  @ApiOperation({
    description: 'Update an existing Load by ID',
  })
  @ApiResponse({
    status: HttpStatus.OK,
  })
  @Patch('/:loadId')
  @HttpCode(HttpStatus.OK)
  async update(
    @Param('clientId', ParseUUIDPipe) clientId: string,
    @Param('loadId', ParseUUIDPipe) loadId: string,
    @Body() request: UpdateLoadRequest,
  ): Promise<Load> {
    const entity = await this.loadsService.update(clientId, loadId, request);
    return this.loadMapper.entityToModel(entity);
  }

  @ApiOperation({
    description: 'Delete load',
  })
  @ApiResponse({
    status: HttpStatus.OK,
  })
  @Post(':loadId/factor')
  @HttpCode(HttpStatus.OK)
  async factor(
    @Param('clientId', ParseUUIDPipe) clientId: string,
    @Param('loadId', ParseUUIDPipe) loadId: string,
    @Body() request: FactorLoadRequest,
  ): Promise<void> {
    await this.loadsService.factor(clientId, loadId, request);
  }

  @ApiOperation({
    description: 'Get load by id',
  })
  @ApiResponse({
    status: HttpStatus.OK,
  })
  @Get(':loadId')
  @HttpCode(HttpStatus.OK)
  async getOneById(
    @Param('clientId', ParseUUIDPipe) clientId: string,
    @Param('loadId', ParseUUIDPipe) loadId: string,
  ) {
    return await this.loadsService.getOneById(clientId, loadId);
  }
}
