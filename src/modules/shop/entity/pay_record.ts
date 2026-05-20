import { BaseEntity } from '../../base/entity/base';
import { Column, Entity, Index } from 'typeorm';

/**
 * 支付记录
 */
@Entity('shop_pay_record')
export class ShopPayRecordEntity extends BaseEntity {
  @Index()
  @Column({ comment: '用户ID' })
  userId: number;

  @Index()
  @Column({ comment: '订单ID' })
  orderId: number;

  @Index()
  @Column({
    comment: '支付渠道 balance-余额 wechat-微信 alipay-支付宝',
    length: 20,
  })
  payChannel: string;

  @Column({ comment: '第三方交易号', nullable: true, length: 64 })
  transactionId: string;

  @Column({
    comment: '支付金额（单位：分）',
    type: 'bigint',
  })
  amount: number;

  @Column({ comment: '状态 0-处理中 1-成功 -1-失败', default: 0 })
  status: number;

  @Column({ comment: '回调原始数据', type: 'text', nullable: true })
  callbackData: string;

  @Column({ comment: '失败原因', nullable: true })
  failReason: string;

  @Column({ comment: '支付成功时间', nullable: true })
  successTime: string;
}
