import { createApp, close } from '@midwayjs/mock';
import { Framework } from '@midwayjs/koa';
import { ShopGoodsService } from '../src/modules/shop/service/goods';
import * as path from 'path';

describe('Shop Goods Module Integration', () => {
  let app;
  let goodsService;

  beforeAll(async () => {
    app = await createApp<Framework>(path.join(__dirname, '..'));
    goodsService = await app.getApplicationContext().getAsync(ShopGoodsService);
  });

  afterAll(async () => {
    await close(app);
  });

  it('should create a goods', async () => {
    const result = await goodsService.save({ name: '测试商品', categoryId: 1, brandId: 1, coverImage: 'http://example.com/i.png', price: 9900, originalPrice: 12900, stock: 100, status: 1, specType: 0 });
    expect(result.id).toBeDefined();
    expect(result.name).toBe('测试商品');
  });

  it('should list goods', async () => {
    await goodsService.save({ name: '商品A', price: 9900, stock: 50, status: 1, specType: 0 });
    await goodsService.save({ name: '商品B', price: 19900, stock: 30, status: 1, specType: 0 });
    const result = await goodsService.list({});
    expect(result.list.length).toBeGreaterThanOrEqual(2);
  });

  it('should update goods stock', async () => {
    const goods = await goodsService.save({ name: '库存测试', price: 9900, stock: 50, status: 1, specType: 0 });
    await goodsService.update(goods.id, { stock: 30 });
    const updated = await goodsService.info(goods.id);
    expect(updated.stock).toBe(30);
  });

  it('should convert fen to yuan', () => {
    const fenToYuan = (fen) => parseFloat((fen / 100).toFixed(2));
    expect(fenToYuan(9900)).toBe(99);
    expect(fenToYuan(0)).toBe(0);
    expect(fenToYuan(150)).toBe(1.5);
  });

  it('should calculate discount rate', () => {
    const price = 9900;
    const originalPrice = 12900;
    const rate = ((originalPrice - price) / originalPrice * 100).toFixed(1);
    expect(parseFloat(rate)).toBeGreaterThan(0);
  });
});
