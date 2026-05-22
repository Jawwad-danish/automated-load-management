import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database';
import { TagDefinitionMapper } from './data';
import { TagDefinitionService } from './services';
import { PersistenceModule } from '@module-persistence';

@Module({
  providers: [TagDefinitionMapper, TagDefinitionService],
  exports: [TagDefinitionService, TagDefinitionMapper],
  imports: [DatabaseModule, PersistenceModule],
})
export class TagDefinitionsModule {}
