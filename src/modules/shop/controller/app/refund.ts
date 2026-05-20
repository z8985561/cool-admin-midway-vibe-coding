import { CoolController, BaseController } from '@cool-midway/core';
import { Inject, Get, Post, Query, Body } from '@midwayjs/core';
import { ShopRefundService } from '../../service/refund';

/**
 * 用户端-退款
 */
@CoolController()
export class AppShopRefundController extends BaseController {
  @Inject()
  shopRefundService: ShopRefundService;

  @Inject()
  ctx;

  /**
   * 申请退款
   */
  @Post('/apply')
  async apply(
    @Body('orderId') orderId: number,
    @Body('reason') reason: string,
    @Body('description') description: string,
    @Body('images') images: string[]
  ) {
    return this.ok(
      await this.shopRefundService.apply(
        this.ctx.user.id,
        orderId,
        reason,
        description,
        images
      )
    );
  }

  /**
   * 我的退款列表
   */
  @Get('/list')
  async list() {
    return this.ok(
      await this.shopRefundService.listByUser(this.ctx.user.id)
    );
  }
}
