import { CoolController, BaseController } from '@cool-midway/core';
import { ShopRefundEntity } from '../../entity/refund';
import { ShopRefundService } from '../../service/refund';

@CoolController({
  api: ['add', 'delete', 'update', 'info', 'page'],
  entity: ShopRefundEntity,
  service: ShopRefundService,
})
export class AdminShopRefundController extends BaseController {}
