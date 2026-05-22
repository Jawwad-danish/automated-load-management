import { Test, TestingModule } from '@nestjs/testing';
import { buildStubTagDefinitionEntity } from '../../test';
import { TagDefinitionMapper } from './tag-definition.mapper';

describe('TagDefinitionMapper', () => {
  let mapper: TagDefinitionMapper;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TagDefinitionMapper],
    }).compile();

    mapper = module.get<TagDefinitionMapper>(TagDefinitionMapper);
  }, 60000);

  it('Should be defined', () => {
    expect(mapper).toBeDefined();
  });

  it('Entity is converted to model', async () => {
    const entity = buildStubTagDefinitionEntity();
    const model = await mapper.entityToModel(entity);

    expect(model.id).toBe(entity.id);
    expect(model.key).toBe(entity.key);
    expect(model.level).toBe(entity.level);
    expect(model.createdAt).toStrictEqual(entity.createdAt);
    expect(model.updatedAt).toStrictEqual(entity.updatedAt);
  });
});
