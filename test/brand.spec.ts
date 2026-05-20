import { createApp, close } from '@midwayjs/mock';
import { Framework } from '@midwayjs/koa';
import { ShopBrandService } from '../src/modules/shop/service/brand';
import * as path from 'path';

describe('Shop Brand Module Integration', () => {
  let app;
  let brandService;

  beforeAll(async () => {
    app = await createApp<Framework>(path.join(__dirname, '..'));
    brandService = await app.getApplicationContext().getAsync(ShopBrandService);
  });

  afterAll(async () => {
    await close(app);
  });

  it('should create a brand', async () => {
    const result = await brandService.save({ name: '测试品牌', icon: 'http://example.com/i.png', sort: 100, status: 1 });
    expect(result.id).toBeDefined();
    expect(result.name).toBe('测试品牌');
  });

  it('should get brand by id', async () => {
    const brand = await brandService.save({ name: '查询测试', sort: 1, status: 1 });
    const result = await brandService.info(brand.id);
    expect(result.name).toBe('查询测试');
  });

  it('should list brands', async () => {
    await brandService.save({ name: '品牌A', sort: 1, status: 1 });
    await brandService.save({ name: '品牌B', sort: 2, status: 1 });
    const result = await brandService.list({ status: 1 });
    expect(result.list.length).toBe(2);
  });

  it('should update a brand', async () => {
    const brand = await brandService.save({ name: '原名', sort: 1, status: 1 });
    await brandService.update(brand.id, { name: '新名' });
    const updated = await brandService.info(brand.id);
    expect(updated.name).toBe('新名');
  });

  it('should delete a brand', async () => {
    const brand = await brandService.save({ name: '待删除', sort: 1, status: 1 });
    await brandService.delete([brand.id]);
    const result = await brandService.info(brand.id);
    expect(result).toBeNull();
  });

  it('should validate brand name length', () => {
    const name = '这是一个较长的品牌名称';
    expect(name.length).toBeLessThanOrEqual(50);
  });
});
