import { CoolController, BaseController } from '@cool-midway/core';
import { Body, Get, Inject, Post, Query } from '@midwayjs/core';
import { ShopWalletService } from '../../service/wallet';

/**
 * 后台-余额管理
 */
@CoolController()
export class AdminShopWalletController extends BaseController {
  @Inject()
  shopWalletService: ShopWalletService;

  @Inject()
  ctx;

  /**
   * 查询用户余额
   * GET /admin/shop/wallet/balance?userId=1
   */
  @Get('/balance')
  async balance(@Query('userId') userId: number) {
    return this.ok(await this.shopWalletService.getBalance(userId));
  }

  /**
   * 后台充值/扣减
   * POST /admin/shop/wallet/recharge
   */
  @Post('/recharge')
  async recharge(
    @Body('userId') userId: number,
    @Body('amount') amount: number,
    @Body('remark') remark: string
  ) {
    return this.ok(
      await this.shopWalletService.recharge(
        userId,
        amount,
        remark || '后台操作',
        this.ctx.admin?.id
      )
    );
  }
}
