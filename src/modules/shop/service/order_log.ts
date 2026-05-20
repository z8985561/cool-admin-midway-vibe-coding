import { Provide } from '@midwayjs/core';
import { BaseService } from '@cool-midway/core';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { Repository, Equal } from 'typeorm';
import { ShopOrderLogEntity } from '../entity/order_log';

@Provide()
export class ShopOrderLogService extends BaseService {
  @InjectEntityModel(ShopOrderLogEntity)
  orderLogRepo: Repository<ShopOrderLogEntity>;

  /**
   * 根据订单ID查询订单日志
   */
  async listByOrder(orderId: number) {
    return await this.orderLogRepo.find({
      where: { orderId: Equal(orderId) },
      order: { createTime: 'ASC' },
    });
  }
}
