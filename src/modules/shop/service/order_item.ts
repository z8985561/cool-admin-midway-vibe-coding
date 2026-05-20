import { Provide } from '@midwayjs/core';
import { BaseService } from '@cool-midway/core';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { Repository, Equal } from 'typeorm';
import { ShopOrderItemEntity } from '../entity/order_item';

@Provide()
export class ShopOrderItemService extends BaseService {
  @InjectEntityModel(ShopOrderItemEntity)
  orderItemRepo: Repository<ShopOrderItemEntity>;

  /**
   * 根据订单ID查询订单项
   */
  async listByOrder(orderId: number) {
    return await this.orderItemRepo.find({
      where: { orderId: Equal(orderId) },
    });
  }
}
