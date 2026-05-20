import { Init, Inject, Provide } from '@midwayjs/core';
import { BaseService, CoolCommException } from '@cool-midway/core';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { Repository, Equal } from 'typeorm';
import { ShopWalletEntity } from '../entity/wallet';
import { ShopWalletLogEntity } from '../entity/wallet_log';

/**
 * 余额服务
 */
@Provide()
export class ShopWalletService extends BaseService {
  @InjectEntityModel(ShopWalletEntity)
  walletRepo: Repository<ShopWalletEntity>;

  @InjectEntityModel(ShopWalletLogEntity)
  logRepo: Repository<ShopWalletLogEntity>;

  @Inject()
  ctx;

  @Init()
  async init() {
    await super.init();
    this.setEntity(this.walletRepo);
  }

  /**
   * 获取用户余额信息（含最新10条记录）
   * @param userId
   */
  async getBalance(userId: number) {
    const wallet = await this.walletRepo.findOneBy({ userId: Equal(userId) });
    if (!wallet) {
      return {
        balance: 0,
        totalRecharge: 0,
        totalConsume: 0,
        logs: [],
      };
    }
    const logs = await this.logRepo.find({
      where: { userId: Equal(userId) },
      order: { createTime: 'DESC' },
      take: 10,
    });
    return {
      balance: wallet.balance,
      totalRecharge: wallet.totalRecharge,
      totalConsume: wallet.totalConsume,
      logs,
    };
  }

  /**
   * 后台充值（或扣减）
   * @param userId 用户ID
   * @param amount 金额（分），正数=充值，负数=扣减
   * @param remark 备注
   * @param operatorId 操作人ID
   */
  async recharge(
    userId: number,
    amount: number,
    remark: string,
    operatorId?: number
  ) {
    // 查询当前余额（直接查，不走事务锁定，因为金额小并发低）
    let wallet = await this.walletRepo.findOneBy({ userId: Equal(userId) });

    if (wallet && wallet.balance + amount < 0) {
      throw new CoolCommException('余额不足，无法扣减');
    }

    if (!wallet) {
      wallet = new ShopWalletEntity();
      wallet.userId = userId;
      wallet.balance = 0;
      wallet.totalRecharge = 0;
      wallet.totalConsume = 0;
    }

    const beforeBalance = wallet.balance;
    wallet.balance += amount;
    wallet.totalRecharge += Math.max(0, amount);
    wallet.totalConsume += Math.max(0, -amount);
    await this.walletRepo.save(wallet);

    // 记录日志
    const log = new ShopWalletLogEntity();
    log.userId = userId;
    log.amount = amount;
    log.type = amount >= 0 ? 'recharge' : 'consume';
    log.relatedType = 'manual';
    log.relatedId = null;
    log.remark = remark;
    log.afterBalance = wallet.balance;
    await this.logRepo.save(log);

    return {
      balance: wallet.balance,
      beforeBalance,
      amount,
    };
  }

  /**
   * 余额消费（用于订单支付）
   * @param userId 用户ID
   * @param orderId 订单ID
   * @param amount 金额（分）
   */
  async deduct(userId: number, orderId: number, amount: number) {
    // 使用事务 + 悲观锁，防止并发扣款超扣
    await this.walletRepo.manager.transaction(async (manager) => {
      await this._deduct(userId, orderId, amount, manager);
    });
  }

  /**
   * 余额消费（无事务版本，用于在外部事务中调用）
   * @param userId 用户ID
   * @param orderId 订单ID
   * @param amount 金额（分）
   * @param manager TypeORM QueryRunner
   */
  async deductNoTx(
    userId: number,
    orderId: number,
    amount: number,
    manager: any
  ) {
    await this._deduct(userId, orderId, amount, manager);
  }

  /**
   * 余额消费核心逻辑（内部复用）
   * @param userId 用户ID
   * @param orderId 订单ID
   * @param amount 金额（分）
   * @param manager TypeORM QueryRunner
   */
  private async _deduct(
    userId: number,
    orderId: number,
    amount: number,
    manager: any
  ) {
    const wallet = await manager.findOne(ShopWalletEntity, {
      where: { userId: Equal(userId) },
      lock: { mode: 'pessimistic_write' },
    });

    if (!wallet || wallet.balance < amount) {
      throw new CoolCommException('余额不足');
    }

    wallet.balance -= amount;
    wallet.totalConsume += amount;
    await manager.save(wallet);

    // 记录日志
    const log = new ShopWalletLogEntity();
    log.userId = userId;
    log.amount = -amount;
    log.type = 'consume';
    log.relatedType = 'order';
    log.relatedId = orderId;
    log.remark = '订单支付';
    log.afterBalance = wallet.balance;
    await manager.save(log);
  }

  /**
   * 退款（退还余额）
   * @param userId 用户ID
   * @param orderId 订单ID
   * @param amount 退款金额（分）
   */
  async refund(userId: number, orderId: number, amount: number) {
    let wallet = await this.walletRepo.findOneBy({ userId: Equal(userId) });

    if (!wallet) {
      wallet = new ShopWalletEntity();
      wallet.userId = userId;
      wallet.balance = 0;
      wallet.totalRecharge = 0;
      wallet.totalConsume = 0;
    }

    wallet.balance += amount;
    // 退款应扣减累计消费，而非增加累计充值
    wallet.totalConsume = Math.max(0, wallet.totalConsume - amount);
    await this.walletRepo.save(wallet);

    // 记录日志
    const log = new ShopWalletLogEntity();
    log.userId = userId;
    log.amount = amount;
    log.type = 'refund';
    log.relatedType = 'order';
    log.relatedId = orderId;
    log.remark = '订单退款';
    log.afterBalance = wallet.balance;
    await this.logRepo.save(log);

    return { balance: wallet.balance };
  }

  /**
   * 按金额单位转换：元转分
   */
  static yuanToFen(yuan: number): number {
    return Math.round(yuan * 100);
  }

  /**
   * 按金额单位转换：分转元
   */
  static fenToYuan(fen: number): number {
    return parseFloat((fen / 100).toFixed(2));
  }
}
