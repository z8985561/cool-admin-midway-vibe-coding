import { CoolController, BaseController } from '@cool-midway/core';
import { ShopBrandEntity } from '../../entity/brand';
import { ShopBrandService } from '../../service/brand';

@CoolController({
  api: ['add', 'delete', 'update', 'info', 'page'],
  entity: ShopBrandEntity,
  service: ShopBrandService,
})
export class AdminShopBrandController extends BaseController {}
