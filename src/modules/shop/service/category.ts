import { Init, Provide } from '@midwayjs/core';
import { BaseService } from '@cool-midway/core';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { Repository } from 'typeorm';
import { ShopCategoryEntity } from '../entity/category';

@Provide()
export class ShopCategoryService extends BaseService {
  @InjectEntityModel(ShopCategoryEntity)
  categoryRepo: Repository<ShopCategoryEntity>;

  @Init()
  async init() {
    await super.init();
    this.setEntity(this.categoryRepo);
  }
}
