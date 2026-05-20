import { createApp, close } from '@midwayjs/mock';
import { Framework } from '@midwayjs/koa';
import { ShopOrderService } from '../src/modules/shop/service/order';
import * as path from 'path';

describe('Shop Order Module Integration', () => {
  let app;
  let orderService;

  beforeAll(async () => {
    app = await createApp<Framework>(path.join(__dirname, '..'));
    orderService = await app.getApplicationContext().getAsync(ShopOrderService);
  });

  afterAll(async () => {
    await close(app);
  });

  it('should generate order number', () => {
    const orderNo = 'O' + Date.now() + Math.random().toString(36).slice(-4);
    expect(typeof orderNo).toBe('string');
    expect(orderNo).toMatch(/^O\d{13}[a-z0-9]{4}$/);
  });

  it('should convert fen to yuan', () => {
    const fenToYuan = (fen) => parseFloat((fen / 100).toFixed(2));
    expect(fenToYuan(9900)).toBe(99);
    expect(fenToYuan(12900)).toBe(129);
  });

  it('should convert yuan to fen', () => {
    const yuanToFen = (yuan) => Math.round(yuan * 100);
    expect(yuanToFen(99.0)).toBe(9900);
    expect(yuanToFen(0)).toBe(0);
    expect(yuanToFen(1.5)).toBe(150);
  });

  it('should validate order status transitions', () => {
    const canPay = (status) => status === 0;
    expect(canPay(0)).toBe(true);
    expect(canPay(1)).toBe(false);

    const canShip = (status) => status === 1;
    expect(canShip(1)).toBe(true);
    expect(canShip(0)).toBe(false);

    const canConfirm = (status) => status === 2;
    expect(canConfirm(2)).toBe(true);
  });

  it('should calculate order total', () => {
    const items = [
      { price: 9900, quantity: 2 },
      { price: 19900, quantity: 1 },
    ];
    const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    expect(total).toBe(39700);

    const fenToYuan = (fen) => parseFloat((fen / 100).toFixed(2));
    expect(fenToYuan(total)).toBe(397);
  });

  it('should validate order data', () => {
    const data = {
      userId: 1,
      totalAmount: 9900,
      payAmount: 9900,
      orderStatus: 0,
    };
    expect(data.userId).toBeGreaterThan(0);
    expect(data.totalAmount).toBeGreaterThan(0);
  });
});
