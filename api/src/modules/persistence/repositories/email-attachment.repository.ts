import { DatabaseService } from '@module-database';
import { Inject, Injectable } from '@nestjs/common';
import { EmailAttachmentEntity } from '../entities';
import { BasicRepository } from './basic-repository';
import { FindAllOptions, FindOneOrFailOptions } from '@mikro-orm/core';

@Injectable()
export class EmailAttachmentRepository extends BasicRepository<EmailAttachmentEntity> {
  constructor(@Inject(DatabaseService) databaseService: DatabaseService) {
    super(databaseService, EmailAttachmentEntity);
  }

  async findByIds<P extends string = never>(
    ids: string[],
    options?: FindAllOptions<EmailAttachmentEntity, P>,
  ): Promise<EmailAttachmentEntity[]> {
    return await this.repository.findAll({
      where: { id: { $in: ids } },
      ...options,
    });
  }

  async getOneById<P extends string = never>(
    id: string,
    options?: FindOneOrFailOptions<EmailAttachmentEntity, P>,
  ): Promise<EmailAttachmentEntity> {
    return await this.repository.findOneOrFail(
      {
        id,
      },
      options,
    );
  }
}
