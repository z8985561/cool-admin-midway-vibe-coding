import { BaseEntity } from '../../base/entity/base';
import { Column, Entity, Index } from 'typeorm';
import { transformerJson } from '../../base/entity/base';

/**
 * 订单明细
 */
@Entity('shop_order_item')
export class ShopOrderItemEntity extends BaseEntity {
  @Index()
  @Column({ comment: '订单ID' })
  orderId: number;

  @Index()
  @Column({ comment: '商品ID' })
  goodsId: number;

  @Column({ comment: 'SKU ID', nullable: true })
  skuId: number;

  @Column({ comment: '商品名称（快照）', length: 100 })
  goodsName: string;

  @Column({ comment: 'SKU规格（快照）', type: 'json', nullable: true })
  skuSpecs: Record<string, string>;

  @Column({ comment: 'SKU规格字符串（快照）', nullable: true })
  skuSpecString: string;

  @Column({
    comment: '单价（单位：分）',
    type: 'bigint',
  })
  price: number;

  @Column({ comment: '数量' })
  quantity: number;

  @Column({
    comment: '小计（单位：分）',
    type: 'bigint',
  })
  subtotal: number;

  @Column({ comment: '商品图片（快照）', nullable: true })
  image: string;
}
