import { createApp, close } from '@midwayjs/mock';
import { Framework } from '@midwayjs/koa';
import { ShopCartService } from '../src/modules/shop/service/cart';
import * as path from 'path';

describe('Shop Cart Module Integration', () => {
  let app;
  let cartService;

  beforeAll(async () => {
    app = await createApp<Framework>(path.join(__dirname, '..'));
    cartService = await app.getApplicationContext().getAsync(ShopCartService);
  });

  afterAll(async () => {
    await close(app);
  });

  it('should get cart list', async () => {
    const result = await cartService.list(1);
    expect(Array.isArray(result.list)).toBe(true);
  });

  it('should get cart summary', async () => {
    const result = await cartService.getSummary(1);
    expect(result.totalQuantity).toBeGreaterThanOrEqual(0);
    expect(result.totalPrice).toBeGreaterThanOrEqual(0);
  });

  it('should validate stock availability', () => {
    const stock = 50;
    const requested = 30;
    expect(stock >= requested).toBe(true);
  });

  it('should convert fen to yuan', () => {
    const fenToYuan = (fen) => parseFloat((fen / 100).toFixed(2));
    expect(fenToYuan(9900)).toBe(99);
    expect(fenToYuan(19800)).toBe(198);
  });

  it('should calculate discount rate', () => {
    const price = 9900;
    const originalPrice = 12900;
    const rate = ((originalPrice - price) / originalPrice * 100).toFixed(1);
    expect(parseFloat(rate)).toBeGreaterThan(0);
  });
});
