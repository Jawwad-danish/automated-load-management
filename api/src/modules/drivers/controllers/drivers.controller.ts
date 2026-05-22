import { Arrays } from '@core';
import { Criteria, PageResult, QueryCriteria } from '@core/data';
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
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import {
  CreateDriverRequest,
  Driver,
  DriverMapper,
  UpdateDriverRequest,
} from '../data';
import { DriverService } from '../services/driver.service';

@ApiTags('drivers')
@Controller('/clients/:clientId/drivers')
export class DriversController {
  constructor(
    private readonly driversService: DriverService,
    private readonly mapper: DriverMapper,
  ) {}

  @ApiOperation({
    description: 'Create a driver',
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
  })
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Param('clientId', ParseUUIDPipe) clientId: string,
    @Body() payload: CreateDriverRequest,
  ): Promise<Driver> {
    const entity = await this.driversService.create(payload, clientId);
    return this.mapper.entityToModel(entity);
  }

  @ApiOperation({
    description: 'Update an existing driver by ID',
  })
  @ApiResponse({
    status: HttpStatus.OK,
  })
  @Patch(':driverId')
  @HttpCode(HttpStatus.OK)
  async update(
    @Param('clientId', ParseUUIDPipe) clientId: string,
    @Param('driverId', ParseUUIDPipe) driverId: string,
    @Body() payload: UpdateDriverRequest,
  ): Promise<Driver> {
    const entity = await this.driversService.update(
      driverId,
      clientId,
      payload,
    );
    return this.mapper.entityToModel(entity);
  }

  @ApiOperation({
    description: 'Delete a driver by ID',
  })
  @ApiResponse({
    status: HttpStatus.OK,
  })
  @Delete(':driverId')
  @HttpCode(HttpStatus.OK)
  async delete(
    @Param('clientId', ParseUUIDPipe) clientId: string,
    @Param('driverId', ParseUUIDPipe) driverId: string,
  ): Promise<void> {
    await this.driversService.delete(driverId, clientId);
  }

  @ApiOperation({
    description: 'Get a driver by ID',
  })
  @ApiResponse({
    status: HttpStatus.OK,
  })
  @Get(':driverId')
  @HttpCode(HttpStatus.OK)
  async getOneById(
    @Param('clientId', ParseUUIDPipe) clientId: string,
    @Param('driverId', ParseUUIDPipe) driverId: string,
  ): Promise<Driver> {
    const entity = await this.driversService.getOneById(driverId, clientId);
    return this.mapper.entityToModel(entity);
  }

  @ApiOperation({
    description: 'Find drivers',
  })
  @ApiResponse({
    status: HttpStatus.OK,
  })
  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll(
    @Param('clientId', ParseUUIDPipe) clientId: string,
    @Criteria({
      parseFilterValues: true,
    })
    criteria: QueryCriteria,
  ): Promise<PageResult<Driver>> {
    const result = await this.driversService.findAll(clientId, criteria);
    const models = await Arrays.mapAsync(
      result.items,
      this.mapper.entityToModel,
    );
    return new PageResult(models, result.pagination);
  }
}
