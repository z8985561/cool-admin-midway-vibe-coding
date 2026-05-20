import { CoolController, BaseController } from '@cool-midway/core';
import { Inject, Get, Post, Query, Body } from '@midwayjs/core';
import { ShopReviewService } from '../../service/review';

/**
 * 用户端-评价
 */
@CoolController()
export class AppShopReviewController extends BaseController {
  @Inject()
  shopReviewService: ShopReviewService;

  @Inject()
  ctx;

  /**
   * 发表评论
   */
  @Post('/comment')
  async addComment(
    @Body('orderId') orderId: number,
    @Body('goodsId') goodsId: number,
    @Body('skuId') skuId: number,
    @Body('score') score: number,
    @Body('content') content: string,
    @Body('images') images: string[],
    @Body('isPublic') isPublic: boolean
  ) {
    return this.ok(
      await this.shopReviewService.addReview({
        userId: this.ctx.user.id,
        orderId,
        goodsId,
        skuId,
        score,
        content,
        images,
        isPublic,
      })
    );
  }

  /**
   * 我的评价列表
   */
  @Get('/myList')
  async myPage(
    @Query('page') page: number,
    @Query('pageSize') pageSize: number
  ) {
    return this.ok(
      await this.shopReviewService.page({
        current: (page || 1) - 0,
        pageSize: (pageSize || 10) - 0,
        info: { userId: this.ctx.user.id },
      }, {})
    );
  }

  /**
   * 商品评价列表
   */
  @Get('/goods')
  async goodsList(@Query('goodsId') goodsId: number) {
    return this.ok(
      await this.shopReviewService.findByGoods(goodsId)
    );
  }
}
