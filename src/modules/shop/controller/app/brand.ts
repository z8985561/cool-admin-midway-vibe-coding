import { CoolController, BaseController } from '@cool-midway/core';
import { ShopBrandEntity } from '../../entity/brand';
import { ShopBrandService } from '../../service/brand';

@CoolController({
  api: ['page', 'info'],
  entity: ShopBrandEntity,
  service: ShopBrandService,
  pageQueryOp: {
    where: async () => {
      return [['status = 1']];
    },
    addOrderBy: { sort: 'ASC' },
  },
})
export class AppShopBrandController extends BaseController {}
