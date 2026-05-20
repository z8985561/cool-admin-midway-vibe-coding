import { BaseEntity } from '../../base/entity/base';
import { Column, Entity, Index } from 'typeorm';

/**
 * 余额变动日志
 */
@Entity('shop_wallet_log')
export class ShopWalletLogEntity extends BaseEntity {
  @Index()
  @Column({ comment: '用户ID' })
  userId: number;

  @Column({
    comment: '变动金额（单位：分），正数=收入，负数=支出',
    type: 'bigint',
  })
  amount: number;

  @Index()
  @Column({
    comment: '类型 recharge-充值 consume-消费 refund-退款 cancel-取消订单返还',
    length: 20,
  })
  type: string;

  @Column({
    comment: '关联类型 order-订单 manual-手动 transfer-转账',
    length: 20,
    default: 'manual',
  })
  relatedType: string;

  @Column({ comment: '关联ID（订单ID或充值记录ID）', nullable: true })
  relatedId: number;

  @Column({ comment: '备注', nullable: true })
  remark: string;

  @Column({ comment: '变动后余额（快照）', type: 'bigint' })
  afterBalance: number;
}
