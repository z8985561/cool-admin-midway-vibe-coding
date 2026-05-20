import { BaseEntity } from '../../base/entity/base';
import { Column, Entity, Index } from 'typeorm';
import { transformerJson } from '../../base/entity/base';

/**
 * 订单主表
 */
@Entity('shop_order')
export class ShopOrderEntity extends BaseEntity {
  @Index({ unique: true })
  @Column({ comment: '订单号', length: 32 })
  orderNo: string;

  @Index()
  @Column({ comment: '用户ID' })
  userId: number;

  @Column({ comment: '商品总金额（单位：分）', type: 'bigint' })
  totalAmount: number;

  @Column({ comment: '运费（单位：分）', type: 'bigint', default: 0 })
  freightAmount: number;

  @Column({ comment: '优惠金额（单位：分）', type: 'bigint', default: 0 })
  discountAmount: number;

  @Column({
    comment: '实付金额（单位：分）',
    type: 'bigint',
  })
  payAmount: number;

  @Column({
    comment: '支付方式 balance-余额 wechat-微信 alipay-支付宝',
    nullable: true,
    length: 20,
  })
  payMethod: string;

  @Column({ comment: '支付状态 0-未支付 1-已支付', default: 0 })
  payStatus: number;

  @Index()
  @Column({
    comment: '订单状态 0-待付款 1-待发货 2-已发货 3-已完成 -1-已取消 -2-已退款',
    default: 0,
  })
  orderStatus: number;

  @Column({ comment: '收货地址JSON', type: 'json' })
  address: {
    contact: string;
    phone: string;
    province: string;
    city: string;
    district: string;
    address: string;
    isDefault: boolean;
  };

  @Column({ comment: '买家备注', nullable: true })
  remark: string;

  @Column({ comment: '支付时间', nullable: true })
  payTime: string;

  @Column({ comment: '发货时间', nullable: true })
  shipTime: string;

  @Column({ comment: '确认收货时间', nullable: true })
  confirmTime: string;

  @Column({ comment: '取消时间', nullable: true })
  closeTime: string;

  @Column({ comment: '取消原因', nullable: true })
  closeReason: string;

  @Index()
  @Column({ comment: '创建时间索引', nullable: true })
  createTimeIdx: string;
}
