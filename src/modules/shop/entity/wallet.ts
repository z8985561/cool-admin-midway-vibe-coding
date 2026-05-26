import { BaseEntity } from '../../base/entity/base';
import { Column, Entity, Index, Unique } from 'typeorm';
import { transformerJson } from '../../base/entity/base';

/**
 * 用户余额表
 */
@Entity('shop_wallet')
@Unique('shop_wallet_userId_unique', ['userId'])
export class ShopWalletEntity extends BaseEntity {
  @Column({ comment: '用户ID' })
  userId: number;
  @Column({
    comment: '当前余额（单位：分）',
    type: 'bigint',
    default: 0,
  })
  balance: number;

  @Column({
    comment: '累计充值（单位：分）',
    type: 'bigint',
    default: 0,
  })
  totalRecharge: number;

  @Column({
    comment: '累计消费（单位：分）',
    type: 'bigint',
    default: 0,
  })
  totalConsume: number;

  @Column({ comment: '版本号，用于乐观锁', default: 0 })
  version: number;
}
