import { CoolController, BaseController } from '@cool-midway/core';
import { ShopReviewEntity } from '../../entity/review';
import { ShopReviewService } from '../../service/review';

@CoolController({
  api: ['add', 'delete', 'update', 'info', 'page'],
  entity: ShopReviewEntity,
  service: ShopReviewService,
})
export class AdminShopReviewController extends BaseController {}
