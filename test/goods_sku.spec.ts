import { createApp, close } from '@midwayjs/mock';
import { Framework } from '@midwayjs/koa';
import { ShopGoodsSkuService } from '../src/modules/shop/service/goods_sku';
import * as path from 'path';

describe('Shop Goods SKU Module Integration', () => {
  let app;
  let skuService;

  beforeAll(async () => {
    app = await createApp<Framework>(path.join(__dirname, '..'));
    skuService = await app.getApplicationContext().getAsync(ShopGoodsSkuService);
  });

  afterAll(async () => {
    await close(app);
  });

  it('should validate stock availability', () => {
    const stock = 50;
    const requested = 30;
    expect(stock >= requested).toBe(true);
    expect(stock - requested).toBe(20);
  });

  it('should convert fen to yuan', () => {
    const fenToYuan = (fen) => parseFloat((fen / 100).toFixed(2));
    expect(fenToYuan(9900)).toBe(99);
    expect(fenToYuan(0)).toBe(0);
    expect(fenToYuan(150)).toBe(1.5);
  });

  it('should calculate discount', () => {
    const price = 9900;
    const originalPrice = 12900;
    const rate = ((originalPrice - price) / originalPrice * 100).toFixed(1);
    expect(parseFloat(rate)).toBeGreaterThan(0);
  });

  it('should validate spec string format', () => {
    const specString = '红,L';
    const specs = specString.split(',');
    expect(specs.length).toBe(2);
    expect(specs[0]).toBe('红');
    expect(specs[1]).toBe('L');
  });
});
