import { BaseEntity } from '../../base/entity/base';
import { Column, Entity, Index } from 'typeorm';
import { transformerJson } from '../../base/entity/base';

/**
 * 商品SKU
 */
@Entity('shop_goods_sku')
export class ShopGoodsSkuEntity extends BaseEntity {
  @Index()
  @Column({ comment: 'SPU ID' })
  goodsId: number;

  @Index()
  @Column({ comment: 'SKU编码', nullable: true, length: 50 })
  skuCode: string;

  @Column({ comment: '规格组合JSON', type: 'json' })
  specs: Record<string, string>;

  @Column({ comment: '规格字符串 如 红,M', nullable: true, length: 100 })
  specString: string;

  @Column({
    comment: '价格（单位：分）',
    type: 'bigint',
  })
  price: number;

  @Column({
    comment: '原价（单位：分）',
    type: 'bigint',
    nullable: true,
  })
  originalPrice: number;

  @Column({ comment: '库存', default: 0 })
  stock: number;

  @Column({ comment: '锁定库存', default: 0 })
  lockStock: number;

  @Column({ comment: 'SKU图片', nullable: true })
  image: string;
}
