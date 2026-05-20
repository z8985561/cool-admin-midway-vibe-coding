import { ModuleConfig } from '@cool-midway/core';

/**
 * 商城模块配置
 */
export default () => {
  return {
    // 模块名称
    name: '商城模块',
    // 模块描述
    description: '电商商城核心功能，包含商品、订单、支付、余额、优惠券等',
    // 中间件，只对本模块有效
    middlewares: [],
    // 中间件，全局有效
    globalMiddlewares: [],
    // 模块加载顺序，默认为0，值越大越优先加载
    order: 10,
  } as ModuleConfig;
};
