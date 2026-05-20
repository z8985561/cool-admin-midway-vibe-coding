import { CoolController, BaseController } from '@cool-midway/core';
import { Inject, Get, Post, Query, Body } from '@midwayjs/core';
import { ShopCartService } from '../../service/cart';

/**
 * 用户端-购物车扩展接口
 */
@CoolController()
export class AppShopCartExtController extends BaseController {
  @Inject()
  shopCartService: ShopCartService;

  @Inject()
  ctx;

  /**
   * 获取购物车摘要
   * GET /app/shop/cart/summary
   */
  @Get('/summary')
  async summary() {
    return this.ok(
      await this.shopCartService.getSummary(this.ctx.user.id)
    );
  }

  /**
   * 切换选中状态
   * POST /app/shop/cart/toggleChecked
   */
  @Post('/toggleChecked')
  async toggleChecked(
    @Body('id') id: number,
    @Body('checked') checked: number
  ) {
    return this.ok(
      await this.shopCartService.toggleChecked(id, checked)
    );
  }

  /**
   * 批量选中
   * POST /app/shop/cart/batchToggleChecked
   */
  @Post('/batchToggleChecked')
  async batchToggleChecked(
    @Body('ids') ids: number[],
    @Body('checked') checked: number
  ) {
    return this.ok(
      await this.shopCartService.batchToggleChecked(ids, checked)
    );
  }

  /**
   * 更新数量
   * POST /app/shop/cart/updateQuantity
   */
  @Post('/updateQuantity')
  async updateQuantity(
    @Body('id') id: number,
    @Body('quantity') quantity: number
  ) {
    return this.ok(
      await this.shopCartService.updateItemQuantity(id, quantity)
    );
  }

  /**
   * 清空已选
   * POST /app/shop/cart/clearChecked
   */
  @Post('/clearChecked')
  async clearChecked() {
    return this.ok(await this.shopCartService.clearChecked());
  }
}
