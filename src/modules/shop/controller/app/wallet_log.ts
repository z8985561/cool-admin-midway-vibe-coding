import { CoolController, BaseController } from '@cool-midway/core';
import { ShopWalletLogEntity } from '../../entity/wallet_log';

/**
 * 用户端-余额日志
 */
@CoolController({
  api: ['page'],
  entity: ShopWalletLogEntity,
  pageQueryOp: {
    where: async ctx => {
      return [['userId = :userId', { userId: ctx.user.id }]];
    },
    addOrderBy: {
      createTime: 'DESC',
    },
  },
})
export class AppShopWalletLogController extends BaseController {}
