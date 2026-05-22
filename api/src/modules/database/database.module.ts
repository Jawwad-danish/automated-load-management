import { Module } from '@nestjs/common';
import { databaseServiceProvider } from './database.provider';
import { DatabaseService } from './database.service';
import { DatabaseCredentialsModule } from './database-credentials.module';

@Module({
  imports: [DatabaseCredentialsModule],
  providers: [databaseServiceProvider],
  exports: [DatabaseService],
})
export class DatabaseModule {}
