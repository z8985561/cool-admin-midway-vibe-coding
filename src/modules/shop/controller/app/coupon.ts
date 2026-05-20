import { CoolController, BaseController } from '@cool-midway/core';
import { Inject, Get, Post, Query, Body } from '@midwayjs/core';
import { ShopCouponService } from '../../service/coupon';

/**
 * 用户端-优惠券
 */
@CoolController()
export class AppShopCouponController extends BaseController {
  @Inject()
  shopCouponService: ShopCouponService;

  @Inject()
  ctx;

  /**
   * 我的优惠券
   */
  @Get('/my')
  async my(
    @Query('status') status: number,
    @Query('page') page: number,
    @Query('pageSize') pageSize: number
  ) {
    return this.ok(
      await this.shopCouponService.myPage(
        this.ctx.user.id,
        status,
        (page || 1) - 0,
        (pageSize || 10) - 0
      )
    );
  }

  /**
   * 可领优惠券列表
   */
  @Get('/available')
  async available(@Query('goodsId') goodsId: number) {
    return this.ok(
      await this.shopCouponService.getAvailable(goodsId)
    );
  }

  /**
   * 领取优惠券
   */
  @Post('/receive')
  async receive(@Body('couponId') couponId: number) {
    return this.ok(
      await this.shopCouponService.receive(this.ctx.user.id, couponId)
    );
  }
}
