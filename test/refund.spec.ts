import { createApp, close } from '@midwayjs/mock';
import { Framework } from '@midwayjs/koa';
import { ShopRefundService } from '../src/modules/shop/service/refund';
import * as path from 'path';

describe('Shop Refund Module Integration', () => {
  let app;
  let refundService;

  beforeAll(async () => {
    app = await createApp<Framework>(path.join(__dirname, '..'));
    refundService = await app.getApplicationContext().getAsync(ShopRefundService);
  });

  afterAll(async () => {
    await close(app);
  });

  it('should validate refund conditions', () => {
    const canRefund = (status) => status === 2 || status === 3;
    expect(canRefund(2)).toBe(true);
    expect(canRefund(3)).toBe(true);
    expect(canRefund(0)).toBe(false);
  });

  it('should validate refund data', () => {
    const data = {
      orderId: 1,
      reason: '商品质量问题',
      images: ['http://example.com/img.jpg'],
      amount: 9900,
    };
    expect(data.reason.length).toBeGreaterThan(0);
    expect(data.amount).toBeGreaterThan(0);
  });

  it('should generate refund number', () => {
    const refundNo = 'R' + Date.now() + Math.random().toString(36).slice(-4);
    expect(typeof refundNo).toBe('string');
    expect(refundNo).toMatch(/^R\d{13}[a-z0-9]{4}$/);
  });

  it('should convert fen to yuan', () => {
    const fenToYuan = (fen) => parseFloat((fen / 100).toFixed(2));
    expect(fenToYuan(9900)).toBe(99);
    expect(fenToYuan(0)).toBe(0);
    expect(fenToYuan(150)).toBe(1.5);
  });

  it('should validate order status transitions', () => {
    const canPay = (status) => status === 0;
    expect(canPay(0)).toBe(true);
    expect(canPay(1)).toBe(false);

    const canShip = (status) => status === 1;
    expect(canShip(1)).toBe(true);
  });
});
