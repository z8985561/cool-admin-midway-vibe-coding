import { Init, Inject, Provide } from '@midwayjs/core';
import { BaseService, CoolCommException } from '@cool-midway/core';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { Repository, Equal } from 'typeorm';
import { ShopAddressEntity } from '../entity/address';

@Provide()
export class ShopAddressService extends BaseService {
  @InjectEntityModel(ShopAddressEntity)
  addressRepo: Repository<ShopAddressEntity>;

  @Inject()
  ctx;

  @Init()
  async init() {
    await super.init();
    this.setEntity(this.addressRepo);
  }

  /**
   * 获取用户地址列表
   */
  async list() {
    return await this.addressRepo.find({
      where: { userId: Equal(this.ctx.user.id) },
      order: { isDefault: 'DESC', createTime: 'DESC' },
    });
  }
}
