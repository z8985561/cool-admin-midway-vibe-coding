import { BaseEntity } from '../../base/entity/base';
import { Column, Entity, Index } from 'typeorm';

/**
 * 商品评论
 */
@Entity('shop_review')
export class ShopReviewEntity extends BaseEntity {
  @Index()
  @Column({ comment: '用户ID' })
  userId: number;

  @Index()
  @Column({ comment: '商品ID' })
  goodsId: number;

  @Index()
  @Column({ comment: 'SKU ID', nullable: true })
  skuId: number;

  @Column({ comment: '评分 1-5星', default: 5 })
  score: number;

  @Column({ comment: '评价内容', type: 'text', nullable: true })
  content: string;

  @Column({ comment: '图片数组', type: 'json', nullable: true })
  images: string[];

  @Column({ comment: '是否公开', default: true })
  isPublic: boolean;

  @Column({ comment: '商家回复', type: 'text', nullable: true })
  reply: string;

  @Column({ comment: '商家回复时间', nullable: true })
  replyTime: string;
}
