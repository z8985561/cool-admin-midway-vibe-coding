import { BaseEntity } from '../../base/entity/base';
import { Column, Entity, Index } from 'typeorm';

/**
 * 订单操作日志
 */
@Entity('shop_order_log')
export class ShopOrderLogEntity extends BaseEntity {
  @Index()
  @Column({ comment: '订单ID' })
  orderId: number;

  @Column({ comment: '操作人ID', nullable: true })
  operatorId: number;

  @Column({ comment: '操作人类型 admin-管理员 user-用户 system-系统', length: 10 })
  operatorType: string;

  @Column({ comment: '操作描述', length: 200 })
  action: string;

  @Column({ comment: '详情', type: 'text', nullable: true })
  detail: string;
}
