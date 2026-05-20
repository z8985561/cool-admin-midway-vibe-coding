import { Init, Provide } from '@midwayjs/core';
import { BaseService } from '@cool-midway/core';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { Repository } from 'typeorm';
import { ShopGoodsSkuEntity } from '../entity/goods_sku';

@Provide()
export class ShopGoodsSkuService extends BaseService {
  @InjectEntityModel(ShopGoodsSkuEntity)
  skuRepo: Repository<ShopGoodsSkuEntity>;

  @Init()
  async init() {
    await super.init();
    this.setEntity(this.skuRepo);
  }
}
