import { CoolController, BaseController } from '@cool-midway/core';
import { Inject, Post, Provide } from '@midwayjs/core';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { Repository } from 'typeorm';
import { ShopGoodsEntity } from '../../entity/goods';
import { ShopOrderEntity } from '../../entity/order';
import { ShopCouponEntity } from '../../entity/coupon';
import { ShopWalletEntity } from '../../entity/wallet';
import { ShopReviewEntity } from '../../entity/review';

/**
 * 商城数据概览
 */
@Provide()
@CoolController()
export class AdminShopDashboardController extends BaseController {

  @InjectEntityModel(ShopGoodsEntity)
  shopGoodsEntity: Repository<ShopGoodsEntity>;

  @InjectEntityModel(ShopOrderEntity)
  shopOrderEntity: Repository<ShopOrderEntity>;

  @InjectEntityModel(ShopCouponEntity)
  shopCouponEntity: Repository<ShopCouponEntity>;

  @InjectEntityModel(ShopWalletEntity)
  shopWalletEntity: Repository<ShopWalletEntity>;

  @InjectEntityModel(ShopReviewEntity)
  shopReviewEntity: Repository<ShopReviewEntity>;

  @Inject()
  ctx;

  /**
   * 数据概览
   */
  @Post('/overview')
  async overview() {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    // 商品统计
    const goodsTotal = await this.shopGoodsEntity.count();
    const goodsOnSale = await this.shopGoodsEntity.count({ where: { status: 1 } });

    // 订单统计
    const orderTotal = await this.shopOrderEntity.count();
    const orderToday = await this.shopOrderEntity
      .createQueryBuilder('o')
      .where('o.createTime >= :today', { today: today.toISOString().slice(0, 10) })
      .getCount();

    // 本月销售额
    const monthSales = await this.shopOrderEntity
      .createQueryBuilder('o')
      .select('COALESCE(SUM(o.payAmount), 0)', 'total')
      .where('o.payStatus = 1')
      .andWhere('o.createTime >= :month', { month: thisMonth.toISOString().slice(0, 10) })
      .getRawOne();

    // 累计销售额
    const totalSales = await this.shopOrderEntity
      .createQueryBuilder('o')
      .select('COALESCE(SUM(o.payAmount), 0)', 'total')
      .where('o.payStatus = 1')
      .getRawOne();

    // 待处理订单
    const pendingOrders = await this.shopOrderEntity
      .createQueryBuilder('o')
      .where('o.orderStatus IN (:...statuses)', { statuses: [0, 1] })
      .getCount();

    // 优惠券统计
    const couponTotal = await this.shopCouponEntity.count();
    const couponActive = await this.shopCouponEntity
      .createQueryBuilder('c')
      .where('c.status = 1')
      .andWhere('c.endTime >= :now', { now })
      .getCount();

    // 余额统计
    const walletStats = await this.shopWalletEntity
      .createQueryBuilder('w')
      .select('COALESCE(SUM(w.balance), 0)', 'totalBalance')
      .addSelect('COUNT(w.id)', 'userCount')
      .getRawOne();

    // 评价统计
    const reviewTotal = await this.shopReviewEntity.count();

    // 卡片数据
    const cards = [
      { label: '商品总数', value: goodsTotal, sub: `在售 ${goodsOnSale} 件`, icon: 'icon-goods', color: '#409EFF' },
      { label: '累计销售额', value: `¥${(Number(totalSales?.total || 0) / 100).toFixed(2)}`, sub: `本月 ¥${(Number(monthSales?.total || 0) / 100).toFixed(2)}`, icon: 'icon-money', color: '#67C23A' },
      { label: '订单总数', value: orderTotal, sub: `今日新增 ${orderToday}`, icon: 'icon-file', color: '#E6A23C' },
      { label: '待处理订单', value: pendingOrders, sub: '待付款/待发货', icon: 'icon-time', color: '#F56C6C' },
      { label: '优惠券', value: couponTotal, sub: `可领取 ${couponActive}`, icon: 'icon-ticket', color: '#909399' },
      { label: '用户余额', value: `¥${(Number(walletStats?.totalBalance || 0) / 100).toFixed(2)}`, sub: `${walletStats?.userCount || 0} 个钱包`, icon: 'icon-wallet', color: '#8B5CF6' },
    ];

    return this.ok({ cards });
  }

  /**
   * 近7天订单趋势
   */
  @Post('/orderTrend')
  async orderTrend() {
    const result = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().slice(0, 10);
      const nextDate = new Date(date);
      nextDate.setDate(nextDate.getDate() + 1);

      const stats = await this.shopOrderEntity
        .createQueryBuilder('o')
        .select('COUNT(o.id)', 'count')
        .addSelect('COALESCE(SUM(CASE WHEN o.payStatus = 1 THEN o.payAmount ELSE 0 END), 0)', 'amount')
        .where('o.createTime >= :start', { start: dateStr })
        .andWhere('o.createTime < :end', { end: nextDate.toISOString().slice(0, 10) })
        .getRawOne();

      result.push({
        date: `${date.getMonth() + 1}/${date.getDate()}`,
        订单数: Number(stats?.count || 0),
        销售额: Math.round(Number(stats?.amount || 0) / 100),
      });
    }
    return this.ok(result);
  }

  /**
   * 商品分类统计
   */
  @Post('/categoryStats')
  async categoryStats() {
    const raw = await this.shopGoodsEntity
      .createQueryBuilder('g')
      .leftJoin('shop_category', 'c', 'c.id = g.categoryId')
      .select('c.name', 'name')
      .addSelect('COUNT(g.id)', 'value')
      .groupBy('c.id')
      .orderBy('value', 'DESC')
      .limit(6)
      .getRawMany();

    return this.ok(raw.map(r => ({ name: r.name || '未分类', value: Number(r.value) })));
  }

  /**
   * 最近订单
   */
  @Post('/recentOrders')
  async recentOrders() {
    const orders = await this.shopOrderEntity.find({
      order: { createTime: 'DESC' },
      take: 5,
    });

    const statusMap: Record<number, string> = {
      [-1]: '已取消',
      [-2]: '已退款',
      0: '待付款',
      1: '待发货',
      2: '已发货',
      3: '已完成',
    };

    return this.ok(orders.map(o => ({
      orderNo: o.orderNo,
      totalAmount: (Number(o.totalAmount) / 100).toFixed(2),
      payAmount: (Number(o.payAmount) / 100).toFixed(2),
      orderStatus: o.orderStatus,
      orderStatusLabel: statusMap[o.orderStatus] || '未知',
      payMethod: o.payMethod || '-',
      createTime: o.createTime,
    })));
  }
}
