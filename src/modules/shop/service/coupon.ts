import { Provide } from '@midwayjs/core';
import { BaseService, CoolCommException } from '@cool-midway/core';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { Repository, Equal, In } from 'typeorm';
import { ShopCouponEntity } from '../entity/coupon';
import { ShopCouponUserEntity } from '../entity/coupon_user';

@Provide()
export class ShopCouponService extends BaseService {
  @InjectEntityModel(ShopCouponEntity)
  couponRepo: Repository<ShopCouponEntity>;

  @InjectEntityModel(ShopCouponUserEntity)
  couponUserRepo: Repository<ShopCouponUserEntity>;

  /**
   * 我的优惠券
   */
  async myPage(userId: number, status: number, current: number, pageSize: number) {
    const where: any = { userId: Equal(userId) };
    if (status !== undefined && status !== null) {
      where.status = status;
    }
    const [userCoupons, total] = await this.couponUserRepo.findAndCount({
      where,
      order: { receiveTime: 'DESC' },
      skip: (current - 1) * pageSize,
      take: pageSize,
    });

    if (userCoupons.length === 0) {
      return { list: [], total };
    }

    const couponIds = userCoupons.map(item => item.couponId);
    const coupons = await this.couponRepo.findBy({ id: In(couponIds) });
    const couponMap = new Map(coupons.map(c => [c.id, c]));

    const list = userCoupons.map(item => {
      const coupon = couponMap.get(item.couponId);
      return {
        ...item,
        couponName: coupon?.name,
        couponType: coupon?.type,
        couponValue: coupon?.value,
        couponMinAmount: coupon?.minAmount,
      };
    });

    return { list, total };
  }

  /**
   * 可领取优惠券
   */
  async getAvailable(goodsId?: number) {
    const now = new Date().toISOString();
    const where: any = {
      status: 1,
    };
    if (goodsId) {
      where.goodsIds = { $overlap: [goodsId] };
    }
    return await this.couponRepo.find({
      where,
      order: { createTime: 'DESC' },
    });
  }

  /**
   * 领取优惠券
   */
  async receive(userId: number, couponId: number) {
    const coupon = await this.couponRepo.findOneBy({ id: Equal(couponId) });
    if (!coupon) {
      throw new CoolCommException('优惠券不存在');
    }
    if (coupon.status !== 1) {
      throw new CoolCommException('优惠券不可领取');
    }
    if (coupon.total >= 0 && coupon.issued >= coupon.total) {
      throw new CoolCommException('优惠券已领完');
    }

    // 检查领取次数限制
    const receivedCount = await this.couponUserRepo.count({
      where: { userId: Equal(userId), couponId: Equal(couponId) },
    });
    if (receivedCount >= coupon.limitPerUser) {
      throw new CoolCommException('已达领取上限');
    }

    const couponUser = new ShopCouponUserEntity();
    couponUser.userId = userId;
    couponUser.couponId = couponId;
    couponUser.status = 0;
    couponUser.receiveTime = new Date().toISOString();

    if (coupon.validityType === 0) {
      couponUser.expireTime = coupon.endTime;
    } else if (coupon.validityType === 1 && coupon.validityDays) {
      const expireDate = new Date();
      expireDate.setDate(expireDate.getDate() + coupon.validityDays);
      couponUser.expireTime = expireDate.toISOString();
    }

    await this.couponUserRepo.save(couponUser);

    coupon.issued = (coupon.issued || 0) + 1;
    await this.couponRepo.save(coupon);

    return true;
  }
}
