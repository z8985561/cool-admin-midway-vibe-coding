import { CoolController, BaseController } from '@cool-midway/core';
import { Get, Inject } from '@midwayjs/core';
import { ShopWalletService } from '../../service/wallet';

/**
 * 用户端-余额管理
 */
@CoolController()
export class AppShopWalletController extends BaseController {
  @Inject()
  shopWalletService: ShopWalletService;

  @Inject()
  ctx;

  /**
   * 查询我的余额
   * GET /app/shop/wallet/balance
   */
  @Get('/balance')
  async balance() {
    return this.ok(await this.shopWalletService.getBalance(this.ctx.user.id));
  }
}
