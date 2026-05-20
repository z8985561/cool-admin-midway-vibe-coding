import { CoolController, BaseController } from '@cool-midway/core';
import { ShopGoodsSkuEntity } from '../../entity/goods_sku';
import { ShopGoodsSkuService } from '../../service/goods_sku';

@CoolController({
  api: ['add', 'delete', 'update', 'info', 'page'],
  entity: ShopGoodsSkuEntity,
  service: ShopGoodsSkuService,
})
export class AdminShopGoodsSkuController extends BaseController {}
