import { Init, Provide } from '@midwayjs/core';
import { BaseService } from '@cool-midway/core';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { Repository } from 'typeorm';
import { ShopGoodsEntity } from '../entity/goods';

@Provide()
export class ShopGoodsServiceExt extends BaseService {
  @InjectEntityModel(ShopGoodsEntity)
  goodsRepo: Repository<ShopGoodsEntity>;

  @Init()
  async init() {
    await super.init();
    this.setEntity(this.goodsRepo);
  }
}
