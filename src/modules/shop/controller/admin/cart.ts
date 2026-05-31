import { CoolController, BaseController } from '@cool-midway/core';
import { ShopCartEntity } from '../../entity/cart';

@CoolController({
  api: ['add', 'delete', 'update', 'info', 'page'],
  entity: ShopCartEntity,
  pageQueryOp: {
    where: async ctx => {
      const { goodsId, skuId } = ctx.query;
      const where = [];
      if (goodsId) {
        where.push(['goodsId = :goodsId', { goodsId }]);
      }
      if (skuId) {
        where.push(['skuId = :skuId', { skuId }]);
      }
      return where;
    },
  },
})
export class AdminShopCartController extends BaseController {}
