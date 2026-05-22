import { Arrays } from '@core/util';
import { Collection } from '@mikro-orm/core';
import { BasicEntity } from '@module-persistence/entities';
import { DataMapper } from './data-mapper';

const isInstanceofDataMapper = <TEntity, TModel>(
  mapper: any,
): mapper is DataMapper<TEntity, TModel> => {
  return 'entityToModel' in mapper;
};

const isMappingFunction = <TEntity, TModel>(
  mapper: any,
): mapper is (entity: TEntity) => Promise<TModel> => {
  return typeof mapper === 'function';
};

export class DataMapperUtil {
  static mapCollections<TEntity extends BasicEntity, TModel extends object>(
    collection: Collection<TEntity> | TEntity[],
    mapper: (entity: TEntity) => TModel,
  ): TModel[] {
    if (collection instanceof Collection && collection.isInitialized()) {
      return collection.map((item) => mapper(item));
    }
    if (Array.isArray(collection)) {
      return collection.map((item) => mapper(item));
    }
    return [];
  }

  static async asyncMapCollections<
    TEntity extends BasicEntity,
    TModel extends object,
  >(
    collection: Collection<TEntity> | TEntity[],
    mapper:
      | ((entity: TEntity) => Promise<TModel>)
      | DataMapper<TEntity, TModel>,
  ): Promise<TModel[]> {
    let items: TEntity[] = [];
    if (collection instanceof Collection && collection.isInitialized()) {
      items = collection.getItems();
    }
    if (Array.isArray(collection)) {
      items = collection;
    }
    if (isInstanceofDataMapper<TEntity, TModel>(mapper)) {
      return await Arrays.mapAsync(items, (item) => mapper.entityToModel(item));
    }
    if (isMappingFunction<TEntity, TModel>(mapper)) {
      return await Arrays.mapAsync(items, mapper);
    }

    throw new Error('Invalid mapper');
  }
}
