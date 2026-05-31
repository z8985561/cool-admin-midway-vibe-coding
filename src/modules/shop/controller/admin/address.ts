import { CoolController, BaseController } from '@cool-midway/core';
import { ShopAddressEntity } from '../../entity/address';

@CoolController({
  api: ['add', 'delete', 'update', 'info', 'page'],
  entity: ShopAddressEntity,
  pageQueryOp: {
    where: async ctx => {
      const { userId, isDefault } = ctx.query;
      const where = [];
      if (userId) {
        where.push(['userId = :userId', { userId }]);
      }
      if (isDefault !== undefined && isDefault !== '') {
        where.push(['isDefault = :isDefault', { isDefault: isDefault === true || isDefault === 'true' }]);
      }
      return where;
    },
    addOrderBy: {
      createTime: 'DESC',
    },
  },
})
export class AdminShopAddressController extends BaseController {}
