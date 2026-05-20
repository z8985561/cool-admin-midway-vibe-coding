import { BaseEntity } from '../../base/entity/base';
import { Column, Entity, Index } from 'typeorm';

/**
 * 优惠券
 */
@Entity('shop_coupon')
export class ShopCouponEntity extends BaseEntity {
  @Column({ comment: '优惠券名称', length: 50 })
  name: string;

  @Index()
  @Column({
    comment: '类型 1-满减券 2-折扣券 3-直减券',
    default: 1,
  })
  type: number;

  @Column({
    comment: '门槛金额（单位：分），0表示无门槛',
    type: 'bigint',
    default: 0,
  })
  minAmount: number;

  @Column({
    comment: '减免金额（单位：分）或折扣比例（折扣券填80表示8折）',
    type: 'bigint',
  })
  value: number;

  @Index()
  @Column({ comment: '可用商品 0-全场 1-指定分类 2-指定商品', default: 0 })
  scope: number;

  @Column({ comment: '适用分类ID数组', type: 'json', nullable: true })
  categoryIds: number[];

  @Column({ comment: '适用商品ID数组', type: 'json', nullable: true })
  goodsIds: number[];

  @Column({ comment: '总库存', default: -1 })
  total: number;

  @Column({ comment: '已领取数量', default: 0 })
  issued: number;

  @Index()
  @Column({ comment: '领取方式 0-免费领取 1-积分兑换', default: 0 })
  receiveType: number;

  @Column({ comment: '积分消耗数量', type: 'bigint', nullable: true })
  pointCost: number;

  @Column({ comment: '每人限领', default: 1 })
  limitPerUser: number;

  @Column({ comment: '开始时间' })
  startTime: string;

  @Column({ comment: '结束时间' })
  endTime: string;

  @Column({
    comment: '有效期类型 0-固定日期 1-领取后N天',
    default: 0,
  })
  validityType: number;

  @Column({ comment: '有效天数', nullable: true })
  validityDays: number;

  @Column({ comment: '状态 0-未开始 1-进行中 2-已结束', default: 0 })
  status: number;
}
