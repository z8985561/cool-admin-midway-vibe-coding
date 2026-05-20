import { CoolController, BaseController } from '@cool-midway/core';
import { ShopOrderEntity } from '../../entity/order';
import { ShopOrderService } from '../../service/order';

/**
 * 后台-订单管理
 */
@CoolController({
  api: ['page', 'info'],
  entity: ShopOrderEntity,
  service: ShopOrderService,
  pageQueryOp: {
    fieldEq: ['orderNo', 'userId', 'orderStatus', 'payStatus'],
    keyWordLikeFields: ['orderNo'],
  },
})
export class AdminShopOrderController extends BaseController {}
