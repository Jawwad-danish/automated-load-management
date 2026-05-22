import { CqrsModule } from '@module-cqrs';
import { PersistenceModule } from '@module-persistence';
import { Module } from '@nestjs/common';
import { DriversController } from './controllers';
import {
  CreateDriverCommandHandler,
  DeleteDriverCommandHandler,
  DriverService,
  FindDriversQueryHandler,
  GetDriverQueryHandler,
  UpdateDriverCommandHandler,
} from './services';
import { DriverMapper } from './data';

const queries = [FindDriversQueryHandler, GetDriverQueryHandler];
const commands = [
  CreateDriverCommandHandler,
  UpdateDriverCommandHandler,
  DeleteDriverCommandHandler,
];
@Module({
  imports: [PersistenceModule, CqrsModule],
  controllers: [DriversController],
  providers: [DriverService, DriverMapper, ...queries, ...commands],
  exports: [DriverService],
})
export class DriversModule {}
