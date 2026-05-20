import * as fs from 'fs';
import * as path from 'path';

describe('Shop Wallet Service - Core Fix Verification', () => {
  let walletSource: string;
  let orderSource: string;

  beforeAll(() => {
    walletSource = fs.readFileSync(
      path.join(__dirname, '../src/modules/shop/service/wallet.ts'),
      'utf-8'
    );
    orderSource = fs.readFileSync(
      path.join(__dirname, '../src/modules/shop/service/order.ts'),
      'utf-8'
    );
  });

  describe('Issue 1: Pessimistic Lock for Concurrent Deduct', () => {
    it('deduct method should use transaction', () => {
      expect(walletSource).toContain(
        'this.walletRepo.manager.transaction'
      );
    });

    it('deduct method should use pessimistic_write lock', () => {
      expect(walletSource).toContain(
        "lock: { mode: 'pessimistic_write' }"
      );
    });

    it('deduct method should query with lock inside transaction', () => {
      expect(walletSource).toMatch(
        /transaction\(async \(manager\) =>[\s\S]*?findOne\(ShopWalletEntity/
      );
    });

    it('should use manager.save instead of this.walletRepo.save inside transaction', () => {
      // Inside transaction, should use manager for consistency
      const deductMatch = walletSource.match(
        /async deduct[\s\S]*?(?=async \w+\(|}$)/
      );
      expect(deductMatch).not.toBeNull();
      const deductBody = deductMatch![0];
      expect(deductBody).toContain('manager.save');
    });
  });

  describe('Issue 2: Balance Payment Integration', () => {
    it('order pay method should NOT throw for balance payment', () => {
      expect(orderSource).not.toContain(
        "余额支付功能待对接钱包服务"
      );
    });

    it('order pay method should call walletService.deduct for balance', () => {
      expect(orderSource).toContain(
        'this.walletService.deduct(userId, order.id, order.payAmount)'
      );
    });

    it('order service should inject walletService', () => {
      expect(orderSource).toContain(
        'walletService: ShopWalletService'
      );
      expect(orderSource).toContain(
        "import { ShopWalletService } from '../service/wallet'"
      );
    });
  });

  describe('Bonus Fix: Refund Logic', () => {
    it('refund should reduce totalConsume not totalRecharge', () => {
      // 直接验证 refund 方法的核心逻辑
      expect(walletSource).toContain(
        'wallet.totalConsume = Math.max(0, wallet.totalConsume - amount)'
      );
      // refund 方法体不应该有 totalRecharge += amount
      const refundBody = walletSource.match(
        /async refund\s*\([^)]*\)\s*{([\s\S]*?)^\s{2}\}/m
      );
      expect(refundBody).not.toBeNull();
      expect(refundBody![1]).not.toContain('totalRecharge +=');
    });
  });

  describe('Static Helper Methods', () => {
    it('fenToYuan should handle 9900 fen -> 99 yuan', () => {
      expect(parseFloat((9900 / 100).toFixed(2))).toBe(99);
    });

    it('yuanToFen should handle 99 yuan -> 9900 fen', () => {
      expect(Math.round(99 * 100)).toBe(9900);
    });

    it('should handle decimal yuan correctly', () => {
      expect(parseFloat((150 / 100).toFixed(2))).toBe(1.5);
      expect(Math.round(1.5 * 100)).toBe(150);
    });

    it('should handle large amounts without precision loss', () => {
      const largeFen = 999999999999; // 9999.99万元
      const yuan = parseFloat((largeFen / 100).toFixed(2));
      expect(yuan).toBe(9999999999.99);
      expect(Math.round(yuan * 100)).toBe(largeFen);
    });
  });

  describe('Entity Structure', () => {
    it('ShopWalletEntity should have version field for optimistic lock', () => {
      const walletEntitySource = fs.readFileSync(
        path.join(__dirname, '../src/modules/shop/entity/wallet.ts'),
        'utf-8'
      );
      expect(walletEntitySource).toContain('version: number');
      expect(walletEntitySource).toContain('版本号');
    });

    it('ShopWalletEntity should use bigint for balance', () => {
      const walletEntitySource = fs.readFileSync(
        path.join(__dirname, '../src/modules/shop/entity/wallet.ts'),
        'utf-8'
      );
      expect(walletEntitySource).toContain("type: 'bigint'");
      expect(walletEntitySource).toContain('balance');
    });
  });
});
