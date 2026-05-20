import { CoolController, BaseController } from '@cool-midway/core';
import { ShopCouponEntity } from '../../entity/coupon';
import { ShopCouponService } from '../../service/coupon';

@CoolController({
  api: ['add', 'delete', 'update', 'info', 'page'],
  entity: ShopCouponEntity,
  service: ShopCouponService,
})
export class AdminShopCouponController extends BaseController {}
