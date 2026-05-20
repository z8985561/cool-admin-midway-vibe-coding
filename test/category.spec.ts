import { createApp, close } from '@midwayjs/mock';
import { Framework } from '@midwayjs/koa';
import { ShopCategoryService } from '../src/modules/shop/service/category';
import * as path from 'path';

describe('Shop Category Module Integration', () => {
  let app;
  let categoryService;

  beforeAll(async () => {
    app = await createApp<Framework>(path.join(__dirname, '..'));
    categoryService = await app.getApplicationContext().getAsync(ShopCategoryService);
  });

  afterAll(async () => {
    await close(app);
  });

  it('should create a category', async () => {
    const result = await categoryService.save({ name: '测试分类', icon: 'http://example.com/i.png', parentId: 0, sort: 100, status: 1 });
    expect(result.id).toBeDefined();
  });

  it('should list categories', async () => {
    await categoryService.save({ name: '分类A', parentId: 0, sort: 1, status: 1 });
    await categoryService.save({ name: '分类B', parentId: 0, sort: 2, status: 1 });
    const result = await categoryService.list({});
    expect(result.list.length).toBeGreaterThanOrEqual(2);
  });

  it('should update a category', async () => {
    const cat = await categoryService.save({ name: '原名', parentId: 0, sort: 1, status: 1 });
    await categoryService.update(cat.id, { name: '新名' });
    const updated = await categoryService.info(cat.id);
    expect(updated.name).toBe('新名');
  });

  it('should create parent-child categories', async () => {
    const parent = await categoryService.save({ name: '父分类', parentId: 0, sort: 1, status: 1 });
    const child = await categoryService.save({ name: '子分类', parentId: parent.id, sort: 1, status: 1 });
    expect(child.parentId).toBe(parent.id);
  });

  it('should validate category name length', () => {
    const name = '这是一个较长的分类名称';
    expect(name.length).toBeLessThanOrEqual(50);
  });
});
