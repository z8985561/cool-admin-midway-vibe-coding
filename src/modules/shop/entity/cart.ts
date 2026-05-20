import { BaseEntity } from '../../base/entity/base';
import { Column, Entity, Index } from 'typeorm';

/**
 * 购物车
 */
@Entity('shop_cart')
export class ShopCartEntity extends BaseEntity {
  @Index()
  @Column({ comment: '用户ID' })
  userId: number;

  @Index()
  @Column({ comment: '商品ID（SPU）' })
  goodsId: number;

  @Column({ comment: 'SKU ID', nullable: true })
  skuId: number;

  @Column({ comment: '商品名称（快照）', length: 100 })
  goodsName: string;

  @Column({ comment: '主图URL', nullable: true })
  coverImage: string;

  @Column({ comment: '单价（单位：分）', type: 'bigint' })
  price: number;

  @Column({ comment: '数量', default: 1 })
  quantity: number;

  @Column({ comment: '是否选中 0-否 1-是', default: 1 })
  checked: number;
}
