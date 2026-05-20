import { BaseEntity } from '../../base/entity/base';
import { Column, Entity, Index } from 'typeorm';

/**
 * 用户优惠券
 */
@Entity('shop_coupon_user')
export class ShopCouponUserEntity extends BaseEntity {
  @Index()
  @Column({ comment: '用户ID' })
  userId: number;

  @Index()
  @Column({ comment: '优惠券ID' })
  couponId: number;

  @Column({
    comment: '状态 0-未使用 1-已使用 2-已过期 -1-已扣减',
    default: 0,
  })
  status: number;

  @Column({ comment: '使用时间', nullable: true })
  useTime: string;

  @Index()
  @Column({ comment: '订单ID（使用时的订单）', nullable: true })
  orderId: number;

  @Column({ comment: '实际抵扣金额（单位：分）', type: 'bigint' })
  actualValue: number;

  @Column({ comment: '领取时间' })
  receiveTime: string;

  @Column({ comment: '过期时间' })
  expireTime: string;
}
