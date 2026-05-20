import { CoolController, BaseController } from '@cool-midway/core';
import { ShopGoodsEntity } from '../../entity/goods';
import { ShopGoodsServiceExt } from '../../service/goods_ext';

@CoolController({
  api: ['page', 'info'],
  entity: ShopGoodsEntity,
  service: ShopGoodsServiceExt,
  pageQueryOp: {
    fieldEq: ['goodsStatus', 'categoryId'],
    keyWordLikeFields: ['name'],
    addOrderBy: { sort: 'ASC', createTime: 'DESC' },
  },
})
export class AppShopGoodsController extends BaseController {}
