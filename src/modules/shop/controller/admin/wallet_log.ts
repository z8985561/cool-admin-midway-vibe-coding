import { CoolController, BaseController } from '@cool-midway/core';
import { ShopWalletLogEntity } from '../../entity/wallet_log';

/**
 * 后台-余额日志
 */
@CoolController({
  api: ['page'],
  entity: ShopWalletLogEntity,
  pageQueryOp: {
    where: async ctx => {
      const { userId, type } = ctx.query;
      const where = [];
      if (userId) {
        where.push(['userId = :userId', { userId }]);
      }
      if (type) {
        where.push(['type = :type', { type }]);
      }
      return where;
    },
    addOrderBy: {
      createTime: 'DESC',
    },
  },
})
export class AdminShopWalletLogController extends BaseController {}
