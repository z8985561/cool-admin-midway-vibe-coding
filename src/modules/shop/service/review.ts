import { Init, Inject, Provide } from '@midwayjs/core';
import { BaseService } from '@cool-midway/core';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { Repository, Equal } from 'typeorm';
import { ShopReviewEntity } from '../entity/review';

@Provide()
export class ShopReviewService extends BaseService {
  @InjectEntityModel(ShopReviewEntity)
  reviewRepo: Repository<ShopReviewEntity>;

  @Inject()
  ctx;

  @Init()
  async init() {
    await super.init();
    this.setEntity(this.reviewRepo);
  }

  /**
   * 发表评论
   */
  async addReview(data: any) {
    const review = new ShopReviewEntity();
    review.userId = data.userId;
    review.goodsId = data.goodsId;
    review.skuId = data.skuId || null;
    review.score = data.score || 5;
    review.content = data.content;
    review.images = data.images;
    review.isPublic = data.isPublic !== false;
    return await this.reviewRepo.save(review);
  }

  /**
   * 评价列表
   */
  async page(query: any, option: any) {
    const where: any = {};
    if (query.info?.userId) {
      where.userId = Equal(query.info.userId);
    }
    const [list, total] = await this.reviewRepo.findAndCount({
      where,
      order: { createTime: 'DESC' },
      skip: (query.current - 1) * query.pageSize,
      take: query.pageSize,
    });
    return {
      list,
      pagination: {
        page: query.current,
        size: query.pageSize,
        total,
      },
    };
  }

  /**
   * 商品评价列表
   */
  async findByGoods(goodsId: number) {
    return await this.reviewRepo.find({
      where: { goodsId: Equal(goodsId), isPublic: true },
      order: { createTime: 'DESC' },
      take: 20,
    });
  }
}
