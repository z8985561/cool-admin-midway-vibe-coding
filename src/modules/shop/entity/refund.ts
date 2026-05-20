import { BaseEntity } from '../../base/entity/base';
import { Column, Entity, Index } from 'typeorm';

/**
 * 退款记录
 */
@Entity('shop_refund')
export class ShopRefundEntity extends BaseEntity {
  @Index()
  @Column({ comment: '订单ID' })
  orderId: number;

  @Column({ comment: '退款单号', length: 32 })
  refundNo: string;

  @Column({
    comment: '退款金额（单位：分）',
    type: 'bigint',
  })
  amount: number;

  @Index()
  @Column({
    comment: '退款原因',
    length: 200,
  })
  reason: string;

  @Column({ comment: '退款说明', type: 'text', nullable: true })
  description: string;

  @Column({ comment: '退款凭证图片', type: 'json', nullable: true })
  images: string[];

  @Index()
  @Column({
    comment: '状态 0-申请中 1-已同意 2-已退款 -1-已拒绝',
    default: 0,
  })
  status: number;

  @Column({ comment: '审核人ID', nullable: true })
  auditorId: number;

  @Column({ comment: '审核时间', nullable: true })
  auditTime: string;

  @Column({ comment: '审核备注', nullable: true })
  auditRemark: string;

  @Column({ comment: '第三方退款单号', nullable: true, length: 64 })
  refundTransactionId: string;
}
