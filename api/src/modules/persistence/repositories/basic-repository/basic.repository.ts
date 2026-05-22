import {
  EntityClass,
  EntityRepository,
  FilterQuery,
  FindOneOptions,
  FindOptions,
  Loaded,
  UpsertManyOptions,
  UpsertOptions,
  Utils,
} from '@mikro-orm/core';
import { EntityManager } from '@mikro-orm/postgresql';
import { DatabaseService } from '@module-database';
import { PrimitiveEntity } from '@module-persistence/entities';

export abstract class BasicRepository<E extends PrimitiveEntity> {
  protected repository: EntityRepository<E>;
  protected entityManager: EntityManager;
  entityName: EntityClass<E>;

  constructor(databaseService: DatabaseService, target: EntityClass<E>) {
    this.entityManager = databaseService.getMikroORM().em as EntityManager;
    this.repository = this.entityManager.getRepository(target);
    this.entityName = target;
  }

  async flush(): Promise<void> {
    return this.entityManager.flush();
  }

  persist(entity: E | E[]) {
    this.entityManager.persist(entity);
    return entity;
  }

  async persistAndFlush(entity: E): Promise<E> {
    await this.entityManager.persistAndFlush(entity);
    return entity;
  }

  async persistAndFlushAll(entities: E[]): Promise<E[]> {
    entities.forEach((e) => this.entityManager.persist(e));
    await this.entityManager.flush();
    return entities;
  }

  async upsertAndFlush(entity: E, options?: UpsertOptions<E>): Promise<E> {
    await this.entityManager.upsert(this.entityName, entity, options);
    await this.entityManager.flush();
    return entity;
  }

  async upsertAndFlushAll(
    entities: E[],
    options?: UpsertManyOptions<E>,
  ): Promise<E[]> {
    const upsertedEntities = await this.entityManager.upsertMany(
      this.entityName,
      entities,
      options,
    );
    await this.entityManager.flush();
    return upsertedEntities;
  }

  findOne(
    where: FilterQuery<E>,
    options?: FindOneOptions<E>,
  ): Promise<E | null> {
    return this.repository.findOne(where, options);
  }

  findAll<P extends string = never>(
    where: FilterQuery<E> = {},
    options?: FindOptions<E, P>,
  ): Promise<[Loaded<E, P>[], number]> {
    return this.repository.findAndCount(where, options);
  }

  execute(query: string, parameters?: any[]): Promise<any> {
    return this.entityManager.execute(query, parameters, 'all');
  }

  count(filterQuery: FilterQuery<E> = {}): Promise<number> {
    return this.repository.count(filterQuery);
  }

  protected getEntityName(): string {
    return Utils.className(this.entityName);
  }

  protected getTableName(): string {
    const metadata = this.entityManager
      .getMetadata()
      .find(this.entityName.name);
    if (!metadata) {
      throw new Error(
        `Could not find metadata for entity ${this.entityName.name}`,
      );
    }
    return metadata.tableName;
  }
}
