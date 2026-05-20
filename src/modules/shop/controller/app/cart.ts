import { CoolController, BaseController } from '@cool-midway/core';
import { ShopCartEntity } from '../../entity/cart';
import { ShopCartService } from '../../service/cart';

/**
 * 用户端-购物车
 */
@CoolController({
  api: ['add', 'delete', 'update', 'info', 'list', 'page'],
  entity: ShopCartEntity,
  service: ShopCartService,
  insertParam: ctx => {
    return { userId: ctx.user.id };
  },
  pageQueryOp: {
    where: async ctx => {
      return [['userId = :userId', { userId: ctx.user.id }]];
    },
    addOrderBy: {
      createTime: 'DESC',
    },
  },
})
export class AppShopCartController extends BaseController {}
