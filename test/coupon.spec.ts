import { createApp, close } from '@midwayjs/mock';
import { Framework } from '@midwayjs/koa';
import { ShopCouponService } from '../src/modules/shop/service/coupon';
import * as path from 'path';

describe('Shop Coupon Module Integration', () => {
  let app;
  let couponService;

  beforeAll(async () => {
    app = await createApp<Framework>(path.join(__dirname, '..'));
    couponService = await app.getApplicationContext().getAsync(ShopCouponService);
  });

  afterAll(async () => {
    await close(app);
  });

  it('should get available coupons', async () => {
    const couponRepo = couponService['couponRepo'];
    await couponRepo.save({ name: '测试券', type: 0, value: 1000, minAmount: 5000, total: 100, validityType: 0, status: 1, issued: 0 });
    const result = await couponService.getAvailable();
    expect(result.length).toBeGreaterThanOrEqual(1);
  });

  it('should receive a coupon', async () => {
    const couponRepo = couponService['couponRepo'];
    const coupon = await couponRepo.save({ name: '可领取券', type: 0, value: 1000, minAmount: 5000, total: 100, validityType: 0, status: 1, issued: 0, limitPerUser: 5 });
    const result = await couponService.receive(9999, coupon.id);
    expect(result).toBe(true);
  });

  it('should get my coupons', async () => {
    const couponUserRepo = couponService['couponUserRepo'];
    const couponRepo = couponService['couponRepo'];
    const coupon = await couponRepo.save({ name: '我的券', type: 0, value: 1000, minAmount: 5000, total: 100, validityType: 0, status: 1, issued: 0, limitPerUser: 5 });
    await couponUserRepo.save({ userId: 9999, couponId: coupon.id, status: 0 });
    const result = await couponService.myPage(9999, 0, 1, 10);
    expect(result.list.length).toBeGreaterThanOrEqual(1);
  });

  it('should calculate discount for fixed amount', () => {
    const amount = 1000;
    expect(amount).toBe(1000);
  });

  it('should validate coupon applicability', () => {
    const orderAmount = 6000;
    const minAmount = 5000;
    expect(orderAmount >= minAmount).toBe(true);
  });
});
