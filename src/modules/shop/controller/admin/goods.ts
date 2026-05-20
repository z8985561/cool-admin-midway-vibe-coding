import { CoolController, BaseController } from '@cool-midway/core';
import { ShopGoodsEntity } from '../../entity/goods';
import { ShopGoodsService } from '../../service/goods';

@CoolController({
  api: ['add', 'delete', 'update', 'info', 'page'],
  entity: ShopGoodsEntity,
  service: ShopGoodsService,
})
export class AdminShopGoodsController extends BaseController {}
