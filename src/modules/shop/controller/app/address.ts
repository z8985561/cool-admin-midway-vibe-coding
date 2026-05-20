import { CoolController, BaseController } from '@cool-midway/core';
import { ShopAddressEntity } from '../../entity/address';
import { ShopAddressService } from '../../service/address';

@CoolController({
  api: ['add', 'delete', 'update', 'info', 'page'],
  entity: ShopAddressEntity,
  service: ShopAddressService,
  pageQueryOp: {
    where: async ctx => {
      return [['userId = :userId', { userId: ctx.user.id }]];
    },
  },
})
export class AppShopAddressController extends BaseController {}
