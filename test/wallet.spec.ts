import { createApp, close } from '@midwayjs/mock';
import { Framework } from '@midwayjs/koa';
import { ShopWalletService } from '../src/modules/shop/service/wallet';
import * as path from 'path';

describe('Shop Wallet Module Integration', () => {
  let app;
  let walletService;
  const testUserId = 9999;

  beforeAll(async () => {
    app = await createApp<Framework>(path.join(__dirname, '..'));
    walletService = await app.getApplicationContext().getAsync(ShopWalletService);
  });

  afterAll(async () => {
    await close(app);
  });

  it('should get initial balance', async () => {
    const result = await walletService.getBalance(testUserId);
    expect(result.balance).toBe(0);
    expect(result.totalRecharge).toBe(0);
  });

  it('should recharge wallet', async () => {
    const result = await walletService.recharge(testUserId, 5000, '测试充值', 0);
    expect(result.balance).toBe(5000);
  });

  it('should verify balance after recharge', async () => {
    await walletService.recharge(testUserId, 10000, '充值测试', 0);
    const result = await walletService.getBalance(testUserId);
    expect(result.balance).toBe(10000);
  });

  it('should deduct wallet balance', async () => {
    await walletService.recharge(testUserId, 10000, '充值', 0);
    await walletService.deduct(testUserId, 1001, 3000);
    const result = await walletService.getBalance(testUserId);
    expect(result.balance).toBe(7000);
    expect(result.totalConsume).toBe(3000);
  });

  it('should fail deduction when insufficient balance', async () => {
    await walletService.recharge(testUserId, 1000, '充值', 0);
    try {
      await walletService.deduct(testUserId, 1001, 9999);
      fail('Should throw');
    } catch (err) {
      expect(err.message).toBe('余额不足');
    }
  });

  it('should refund wallet balance', async () => {
    await walletService.recharge(testUserId, 10000, '充值', 0);
    await walletService.deduct(testUserId, 1001, 3000);
    const refundResult = await walletService.refund(testUserId, 1001, 2000);
    expect(refundResult.balance).toBe(9000);
  });

  it('should validate wallet logs', async () => {
    await walletService.recharge(testUserId, 1000, '充值', 0);
    const result = await walletService.getBalance(testUserId);
    expect(result.logs.length).toBe(1);
    expect(result.logs[0].type).toBe('recharge');
  });

  it('static method: fenToYuan', () => {
    expect(ShopWalletService.fenToYuan(9900)).toBe(99);
    expect(ShopWalletService.fenToYuan(0)).toBe(0);
    expect(ShopWalletService.fenToYuan(150)).toBe(1.5);
  });

  it('static method: yuanToFen', () => {
    expect(ShopWalletService.yuanToFen(99)).toBe(9900);
    expect(ShopWalletService.yuanToFen(0)).toBe(0);
    expect(ShopWalletService.yuanToFen(1.5)).toBe(150);
  });
});
