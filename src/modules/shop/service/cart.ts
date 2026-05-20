import { Init, Inject, Provide } from '@midwayjs/core';
import { BaseService, CoolCommException } from '@cool-midway/core';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { Repository, Equal } from 'typeorm';
import { ShopCartEntity } from '../entity/cart';
import { ShopGoodsEntity } from '../entity/goods';
import { ShopGoodsSkuEntity } from '../entity/goods_sku';

/**
 * 购物车服务
 */
@Provide()
export class ShopCartService extends BaseService {
  @InjectEntityModel(ShopCartEntity)
  cartRepo: Repository<ShopCartEntity>;

  @InjectEntityModel(ShopGoodsEntity)
  goodsRepo: Repository<ShopGoodsEntity>;

  @InjectEntityModel(ShopGoodsSkuEntity)
  skuRepo: Repository<ShopGoodsSkuEntity>;

  @Inject()
  ctx;

  @Init()
  async init() {
    await super.init();
    this.setEntity(this.cartRepo);
  }

  /**
   * 获取用户购物车列表
   */
  async list(userId: number) {
    const items = await this.cartRepo.find({
      where: { userId: Equal(userId) },
      order: { createTime: 'DESC' },
    });

    // 过滤掉下架/库存不足的商品
    const validItems = [];
    for (const item of items) {
      const goods = await this.goodsRepo.findOneBy({
        id: item.goodsId,
        status: 1,
      });
      if (!goods) continue;

      // 检查库存
      let stock = goods.stock;
      if (item.skuId) {
        const sku = await this.skuRepo.findOneBy({ id: item.skuId });
        if (sku) stock = sku.stock;
      }

      validItems.push({
        ...item,
        stock,
        inStock: stock > 0,
      });
    }

    return validItems;
  }

  /**
   * 添加到购物车
   * @param userId 用户ID
   * @param goodsId 商品ID
   * @param skuId SKU ID
   * @param quantity 数量
   */
  async addItem(userId: number, goodsId: number, skuId: number, quantity: number) {
    // 检查商品是否存在且上架
    const goods = await this.goodsRepo.findOneBy({ id: goodsId, status: 1 });
    if (!goods) {
      throw new CoolCommException('商品不存在或已下架');
    }

    // 检查库存
    let stock = goods.stock;
    let price = goods.price;
    if (skuId) {
      const sku = await this.skuRepo.findOneBy({ id: skuId, goodsId });
      if (!sku) {
        throw new CoolCommException('规格不存在');
      }
      if (sku.stock <= 0) {
        throw new CoolCommException('规格库存不足');
      }
      stock = sku.stock;
      price = sku.price;
    }

    if (quantity <= 0) {
      throw new CoolCommException('数量必须大于0');
    }

    if (quantity > stock) {
      throw new CoolCommException('库存不足');
    }

    // 检查是否已在购物车
    let cartItem = await this.cartRepo.findOne({
      where: {
        userId: Equal(userId),
        goodsId: Equal(goodsId),
        skuId: skuId ? Equal(skuId) : null,
      },
    });

    if (cartItem) {
      cartItem.quantity += quantity;
      cartItem.price = price;
      cartItem.goodsName = goods.name;
      cartItem.coverImage = goods.coverImage;
      await this.cartRepo.save(cartItem);
    } else {
      cartItem = new ShopCartEntity();
      cartItem.userId = userId;
      cartItem.goodsId = goodsId;
      cartItem.skuId = skuId || null;
      cartItem.goodsName = goods.name;
      cartItem.coverImage = goods.coverImage;
      cartItem.price = price;
      cartItem.quantity = quantity;
      cartItem.checked = 1;
      await this.cartRepo.save(cartItem);
    }

    return this.getSummary(userId);
  }

  /**
   * 更新数量
   * @param id 购物车项ID
   * @param quantity 数量
   */
  async updateItemQuantity(id: number, quantity: number) {
    const cartItem = await this.cartRepo.findOneBy({ id: Equal(id) });
    if (!cartItem) {
      throw new CoolCommException('购物车项不存在');
    }

    if (quantity <= 0) {
      await this.cartRepo.delete(id);
      return this.getSummary(cartItem.userId);
    }

    // 检查库存
    const goods = await this.goodsRepo.findOneBy({ id: cartItem.goodsId });
    if (!goods) {
      throw new CoolCommException('商品已下架');
    }

    let stock = goods.stock;
    if (cartItem.skuId) {
      const sku = await this.skuRepo.findOneBy({
        id: cartItem.skuId,
        goodsId: Equal(goods.id),
      });
      if (sku) stock = sku.stock;
    }

    if (quantity > stock) {
      throw new CoolCommException('库存不足');
    }

    cartItem.quantity = quantity;
    await this.cartRepo.save(cartItem);

    return this.getSummary(cartItem.userId);
  }

  /**
   * 切换选中状态
   * @param id 购物车项ID
   * @param checked 是否选中
   */
  async toggleChecked(id: number, checked: number) {
    const cartItem = await this.cartRepo.findOneBy({ id: Equal(id) });
    if (!cartItem) {
      throw new CoolCommException('购物车项不存在');
    }

    cartItem.checked = checked;
    await this.cartRepo.save(cartItem);

    return this.getSummary(cartItem.userId);
  }

  /**
   * 批量切换选中
   * @param ids 购物车项ID数组
   * @param checked 是否选中
   */
  async batchToggleChecked(ids: number[], checked: number) {
    await this.cartRepo
      .createQueryBuilder()
      .update()
      .set({ checked })
      .where('id IN (:...ids)', { ids })
      .andWhere('userId = :userId', { userId: this.ctx.user.id })
      .execute();

    return this.getSummary(this.ctx.user.id);
  }

  /**
   * 清空已选中
   */
  async clearChecked() {
    await this.cartRepo
      .createQueryBuilder()
      .delete()
      .where('userId = :userId', { userId: this.ctx.user.id })
      .andWhere('checked = 1')
      .execute();

    return this.getSummary(this.ctx.user.id);
  }

  /**
   * 获取购物车摘要（总数、总金额）
   * @param userId 用户ID
   */
  async getSummary(userId: number) {
    const items = await this.cartRepo.find({
      where: {
        userId: Equal(userId),
        checked: Equal(1),
      },
    });

    const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    return {
      totalQuantity,
      totalPrice,
      itemCount: items.length,
    };
  }
}
