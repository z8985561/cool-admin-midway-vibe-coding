import { Provide } from '@midwayjs/core';
import { BaseService } from '@cool-midway/core';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { Repository, Equal } from 'typeorm';
import { ShopPayRecordEntity } from '../entity/pay_record';

@Provide()
export class ShopPayRecordService extends BaseService {
  @InjectEntityModel(ShopPayRecordEntity)
  payRecordRepo: Repository<ShopPayRecordEntity>;

  /**
   * 用户支付记录
   */
  async listByUser(userId: number) {
    return await this.payRecordRepo.find({
      where: { userId: Equal(userId) },
      order: { createTime: 'DESC' },
    });
  }

  /**
   * 根据订单号查询支付记录
   */
  async findByOrderNo(orderNo: string) {
    return await this.payRecordRepo.findOne({ where: { orderId: Number(orderNo) } });
  }
}
