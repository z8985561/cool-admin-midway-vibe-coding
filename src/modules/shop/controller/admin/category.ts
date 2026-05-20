import { CoolController, BaseController } from '@cool-midway/core';
import { ShopCategoryEntity } from '../../entity/category';
import { ShopCategoryService } from '../../service/category';

@CoolController({
  api: ['add', 'delete', 'update', 'info', 'page'],
  entity: ShopCategoryEntity,
  service: ShopCategoryService,
})
export class AdminShopCategoryController extends BaseController {}
