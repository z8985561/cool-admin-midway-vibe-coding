import { BaseEntity } from '../../base/entity/base';
import { Column, Entity, Index } from 'typeorm';

/**
 * 商品分类
 */
@Entity('shop_category')
export class ShopCategoryEntity extends BaseEntity {
  @Index()
  @Column({ comment: '父级ID', default: 0 })
  parentId: number;

  @Column({ comment: '分类名称', length: 50 })
  name: string;

  @Column({ comment: '图标', nullable: true })
  icon: string;

  @Column({ comment: '排序', default: 0 })
  sort: number;

  @Column({ comment: '状态 0-禁用 1-启用', default: 1 })
  status: number;

  @Column({ comment: '级别 0-一级 1-二级 2-三级', default: 0 })
  level: number;
}
