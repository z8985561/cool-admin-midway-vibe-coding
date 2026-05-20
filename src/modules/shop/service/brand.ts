import { Init, Provide } from '@midwayjs/core';
import { BaseService } from '@cool-midway/core';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { Repository } from 'typeorm';
import { ShopBrandEntity } from '../entity/brand';

@Provide()
export class ShopBrandService extends BaseService {
  @InjectEntityModel(ShopBrandEntity)
  brandRepo: Repository<ShopBrandEntity>;

  @Init()
  async init() {
    await super.init();
    this.setEntity(this.brandRepo);
  }
}
