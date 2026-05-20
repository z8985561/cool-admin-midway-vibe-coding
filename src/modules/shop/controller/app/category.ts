import { CoolController, BaseController } from '@cool-midway/core';
import { ShopCategoryEntity } from '../../entity/category';
import { ShopCategoryService } from '../../service/category';

@CoolController({
  api: ['page', 'info'],
  entity: ShopCategoryEntity,
  service: ShopCategoryService,
})
export class AppShopCategoryController extends BaseController {}
