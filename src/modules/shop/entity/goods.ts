import { BaseEntity } from '../../base/entity/base';
import { Column, Entity, Index } from 'typeorm';
import { transformerJson } from '../../base/entity/base';

/**
 * 商品SPU
 */
@Entity('shop_goods')
export class ShopGoodsEntity extends BaseEntity {
  @Index()
  @Column({ comment: '分类ID', nullable: true })
  categoryId: number;

  @Index()
  @Column({ comment: '品牌ID', nullable: true })
  brandId: number;

  @Column({ comment: '商品名称', length: 100 })
  name: string;

  @Column({ comment: '副标题', nullable: true })
  subtitle: string;

  @Column({
    comment: '商品价格（单位：分）',
    type: 'bigint',
  })
  price: number;

  @Column({
    comment: '原价/划线价（单位：分）',
    type: 'bigint',
    nullable: true,
  })
  originalPrice: number;

  @Column({ comment: '主图URL' })
  coverImage: string;

  @Column({ comment: '详情图数组', type: 'json', nullable: true })
  images: string[];

  @Column({ comment: '详情富文本', type: 'text', nullable: true })
  content: string;

  @Column({ comment: '商品关键字', type: 'json', nullable: true })
  keywords: string[];

  @Column({ comment: '状态 0-下架 1-上架', default: 1 })
  status: number;

  @Index()
  @Column({ comment: '总库存', default: 0 })
  stock: number;

  @Column({ comment: '销量', default: 0 })
  sales: number;

  @Column({ comment: '浏览量', default: 0 })
  views: number;

  @Column({ comment: '运费（单位：分）', type: 'bigint', default: 0 })
  freight: number;

  @Column({ comment: '排序', default: 0 })
  sort: number;

  @Column({ comment: '是否推荐 0-否 1-是', default: 0 })
  isRecommend: number;

  @Column({ comment: '规格类型 0-单规格 1-多规格', default: 0 })
  specType: number;
}
