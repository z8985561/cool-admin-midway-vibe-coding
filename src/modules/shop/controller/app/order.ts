import { CoolController, BaseController } from '@cool-midway/core';
import { Inject, Get, Post, Query, Body } from '@midwayjs/core';
import { ShopOrderService } from '../../service/order';

/**
 * 用户端-订单
 */
@CoolController()
export class AppShopOrderController extends BaseController {
  @Inject()
  shopOrderService: ShopOrderService;

  @Inject()
  ctx;

  /**
   * 创建订单
   * POST /app/shop/order/create
   */
  @Post('/create')
  async create(
    @Body('cartIds') cartIds: number[],
    @Body('addressId') addressId: number,
    @Body('couponId') couponId: number,
    @Body('remark') remark: string,
    @Body('isDirect') isDirect: boolean,
    @Body('goodsInfo') goodsInfo: any
  ) {
    this.ctx.body.goodsInfo = goodsInfo;
    return this.ok(
      await this.shopOrderService.create(
        cartIds,
        addressId,
        couponId,
        remark,
        isDirect
      )
    );
  }

  /**
   * 取消订单
   * POST /app/shop/order/cancel?orderNo=xxx
   */
  @Post('/cancel')
  async cancel(
    @Query('orderNo') orderNo: string,
    @Body('reason') reason: string
  ) {
    this.ctx.body.reason = reason;
    return this.ok(await this.shopOrderService.cancel(orderNo));
  }

  /**
   * 确认收货
   * POST /app/shop/order/confirm?orderNo=xxx
   */
  @Post('/confirm')
  async confirm(@Query('orderNo') orderNo: string) {
    return this.ok(await this.shopOrderService.confirm(orderNo));
  }

  /**
   * 支付订单
   * POST /app/shop/order/pay
   */
  @Post('/pay')
  async pay(
    @Body('orderNo') orderNo: string,
    @Body('payMethod') payMethod: string
  ) {
    return this.ok(await this.shopOrderService.pay(orderNo, payMethod));
  }
}
