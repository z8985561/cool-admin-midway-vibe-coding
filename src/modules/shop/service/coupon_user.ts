import { Provide } from '@midwayjs/core';
import { BaseService } from '@cool-midway/core';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { Repository, Equal } from 'typeorm';
import { ShopCouponUserEntity } from '../entity/coupon_user';

@Provide()
export class ShopCouponUserService extends BaseService {
  @InjectEntityModel(ShopCouponUserEntity)
  couponUserRepo: Repository<ShopCouponUserEntity>;

  /**
   * 用户的优惠券列表
   */
  async listByUser(userId: number) {
    return await this.couponUserRepo.find({
      where: { userId: Equal(userId) },
      order: { receiveTime: 'DESC' },
    });
  }
}
