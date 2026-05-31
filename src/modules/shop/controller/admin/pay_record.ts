import { CoolController, BaseController } from '@cool-midway/core';
import { ShopPayRecordEntity } from '../../entity/pay_record';

@CoolController({
  api: ['add', 'delete', 'update', 'info', 'page'],
  entity: ShopPayRecordEntity,
  pageQueryOp: {
    where: async ctx => {
      const { userId, orderId, payChannel, status } = ctx.query;
      const where = [];
      if (userId) {
        where.push(['userId = :userId', { userId }]);
      }
      if (orderId) {
        where.push(['orderId = :orderId', { orderId }]);
      }
      if (payChannel) {
        where.push(['payChannel = :payChannel', { payChannel }]);
      }
      if (status !== undefined && status !== '') {
        where.push(['status = :status', { status }]);
      }
      return where;
    },
    addOrderBy: {
      createTime: 'DESC',
    },
  },
})
export class AdminShopPayRecordController extends BaseController {}
