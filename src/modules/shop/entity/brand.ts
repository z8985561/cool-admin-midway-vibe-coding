import { BaseEntity } from '../../base/entity/base';
import { Column, Entity, Index } from 'typeorm';

/**
 * 商品品牌
 */
@Entity('shop_brand')
export class ShopBrandEntity extends BaseEntity {
  @Column({ comment: '品牌名称', length: 50 })
  name: string;

  @Column({ comment: '品牌图标', nullable: true })
  icon: string;

  @Column({ comment: '品牌描述', type: 'text', nullable: true })
  description: string;

  @Column({ comment: '排序', default: 0 })
  sort: number;

  @Column({ comment: '状态 0-禁用 1-启用', default: 1 })
  status: number;
}
