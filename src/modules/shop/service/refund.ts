import { Provide } from '@midwayjs/core';
import { BaseService, CoolCommException } from '@cool-midway/core';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { Repository, Equal } from 'typeorm';
import { ShopRefundEntity } from '../entity/refund';
import { ShopOrderEntity } from '../entity/order';

@Provide()
export class ShopRefundService extends BaseService {
  @InjectEntityModel(ShopRefundEntity)
  refundRepo: Repository<ShopRefundEntity>;

  @InjectEntityModel(ShopOrderEntity)
  orderRepo: Repository<ShopOrderEntity>;

  /**
   * 申请退款
   */
  async apply(userId: number, orderId: number, reason: string, description: string, images: string[]) {
    const order = await this.orderRepo.findOne({
      where: { id: Equal(orderId), userId: Equal(userId) },
    });
    if (!order) {
      throw new CoolCommException('订单不存在');
    }
    if (order.orderStatus !== 2 && order.orderStatus !== 3) {
      throw new CoolCommException('当前状态不允许退款');
    }

    const refund = new ShopRefundEntity();
    refund.orderId = orderId;
    refund.refundNo = 'R' + Date.now() + Math.random().toString(36).slice(-4);
    refund.amount = order.payAmount;
    refund.reason = reason;
    refund.description = description;
    refund.images = images;
    refund.status = 0;

    await this.refundRepo.save(refund);

    return refund;
  }

  /**
   * 用户退款列表
   */
  async listByUser(userId: number) {
    const orders = await this.orderRepo.find({
      where: { userId: Equal(userId) },
      select: ['id'],
    });
    const orderIds = orders.map(o => o.id);
    return await this.refundRepo.find({
      where: orderIds.length ? { orderId: Equal(orderIds[0]) } : [],
      order: { createTime: 'DESC' },
      relations: ['order'],
    });
  }
}
