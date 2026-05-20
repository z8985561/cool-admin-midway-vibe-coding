import { Init, Inject, Provide } from '@midwayjs/core';
import { BaseService, CoolCommException } from '@cool-midway/core';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { Repository, Equal, In, IsNull } from 'typeorm';
import { ShopOrderEntity } from '../entity/order';
import { ShopOrderItemEntity } from '../entity/order_item';
import { ShopGoodsEntity } from '../entity/goods';
import { ShopGoodsSkuEntity } from '../entity/goods_sku';
import { ShopAddressEntity } from '../entity/address';
import { ShopCouponUserEntity } from '../entity/coupon_user';
import { ShopCouponEntity } from '../entity/coupon';
import { ShopCartEntity } from '../entity/cart';
import { ShopWalletService } from '../service/wallet';

/**
 * 订单服务
 */
@Provide()
export class ShopOrderService extends BaseService {
  @InjectEntityModel(ShopOrderEntity)
  orderRepo: Repository<ShopOrderEntity>;

  @InjectEntityModel(ShopOrderItemEntity)
  orderItemRepo: Repository<ShopOrderItemEntity>;

  @InjectEntityModel(ShopGoodsEntity)
  goodsRepo: Repository<ShopGoodsEntity>;

  @InjectEntityModel(ShopGoodsSkuEntity)
  skuRepo: Repository<ShopGoodsSkuEntity>;

  @InjectEntityModel(ShopAddressEntity)
  addressRepo: Repository<ShopAddressEntity>;

  @InjectEntityModel(ShopCouponUserEntity)
  couponUserRepo: Repository<ShopCouponUserEntity>;

  @InjectEntityModel(ShopCouponEntity)
  couponRepo: Repository<ShopCouponEntity>;

  @InjectEntityModel(ShopCartEntity)
  cartRepo: Repository<ShopCartEntity>;

  @Inject()
  ctx;

  @Inject()
  walletService: ShopWalletService;

  @Init()
  async init() {
    await super.init();
    this.setEntity(this.orderRepo);
  }

  /**
   * 生成订单号
   */
  private generateOrderNo(): string {
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.random().toString(36).substring(2, 8).toUpperCase();
    return `${timestamp}${random}`;
  }

  /**
   * 分转元
   */
  private fenToYuan(fen: number): number {
    return Number((fen / 100).toFixed(2));
  }

  /**
   * 扣减库存
   * @param items 订单商品明细
   */
  private async deductStock(items: { goodsId: number; skuId?: number; quantity: number }[]) {
    for (const item of items) {
      // 扣减 SKU 库存
      if (item.skuId) {
        const sku = await this.skuRepo.findOneBy({ id: Equal(item.skuId) });
        if (sku) {
          sku.stock -= item.quantity;
          await this.skuRepo.save(sku);
        }
      }
      // 扣减 SPU 总库存
      const goods = await this.goodsRepo.findOneBy({ id: Equal(item.goodsId) });
      if (goods) {
        goods.stock = Math.max(0, goods.stock - item.quantity);
        goods.sales += item.quantity;
        await this.goodsRepo.save(goods);
      }
    }
  }

  /**
   * 恢复库存
   * @param items 订单商品明细
   */
  private async restoreStock(items: { goodsId: number; skuId?: number; quantity: number }[]) {
    for (const item of items) {
      // 恢复 SKU 库存
      if (item.skuId) {
        const sku = await this.skuRepo.findOneBy({ id: Equal(item.skuId) });
        if (sku) {
          sku.stock += item.quantity;
          await this.skuRepo.save(sku);
        }
      }
      // 恢复 SPU 总库存
      const goods = await this.goodsRepo.findOneBy({ id: Equal(item.goodsId) });
      if (goods) {
        goods.stock += item.quantity;
        goods.sales = Math.max(0, goods.sales - item.quantity);
        await this.goodsRepo.save(goods);
      }
    }
  }

  /**
   * 创建订单
   */
  async create(
    cartIds: number[],
    addressId: number,
    couponId: number,
    remark: string,
    isDirect = false
  ) {
    const userId = this.ctx.user.id;

    // 1. 获取收货地址
    const address = await this.addressRepo.findOne({
      where: { id: Equal(addressId), userId: Equal(userId) },
    });
    if (!address) {
      throw new CoolCommException('请选择收货地址');
    }

    // 2. 计算商品明细
    const orderItems: Partial<ShopOrderItemEntity>[] = [];
    const stockCheckItems: { goodsId: number; skuId?: number; quantity: number }[] = [];
    let totalAmount = 0;

    if (isDirect) {
      const goodsInfo = this.ctx.body?.goodsInfo;
      if (!goodsInfo || !goodsInfo.goodsId) {
        throw new CoolCommException('商品信息不完整');
      }

      const goods = await this.goodsRepo.findOneBy({ id: goodsInfo.goodsId, status: 1 });
      if (!goods) {
        throw new CoolCommException('商品不存在或已下架');
      }

      let price = goods.price;
      let stock = goods.stock;

      if (goodsInfo.skuId) {
        const sku = await this.skuRepo.findOneBy({ id: goodsInfo.skuId, goodsId: Equal(goodsInfo.goodsId) });
        if (!sku) throw new CoolCommException('规格不存在');
        price = sku.price;
        stock = sku.stock;
      }

      if (goodsInfo.quantity > stock) {
        throw new CoolCommException('库存不足');
      }

      const subtotal = price * goodsInfo.quantity;
      totalAmount += subtotal;

      orderItems.push({
        goodsId: goods.id,
        skuId: goodsInfo.skuId || null,
        goodsName: goods.name,
        skuSpecs: null,
        skuSpecString: null,
        price,
        quantity: goodsInfo.quantity,
        subtotal,
        image: goods.coverImage,
      });

      stockCheckItems.push({
        goodsId: goods.id,
        skuId: goodsInfo.skuId || undefined,
        quantity: goodsInfo.quantity,
      });
    } else {
      if (!cartIds || cartIds.length === 0) {
        throw new CoolCommException('请选择商品');
      }

      const cartItems = await this.cartRepo.find({
        where: { id: In(cartIds), userId: Equal(userId), checked: Equal(1) },
      });

      if (cartItems.length === 0) {
        throw new CoolCommException('请选择要结算的商品');
      }

      for (const cartItem of cartItems) {
        const goods = await this.goodsRepo.findOneBy({ id: cartItem.goodsId, status: 1 });
        if (!goods) continue;

        let price = goods.price;
        let stock = goods.stock;

        if (cartItem.skuId) {
          const sku = await this.skuRepo.findOneBy({ id: cartItem.skuId, goodsId: Equal(goods.id) });
          if (sku) { price = sku.price; stock = sku.stock; }
        }

        if (cartItem.quantity > stock) {
          throw new CoolCommException(`商品 ${goods.name} 库存不足`);
        }

        const subtotal = price * cartItem.quantity;
        totalAmount += subtotal;

        orderItems.push({
          goodsId: goods.id,
          skuId: cartItem.skuId,
          goodsName: cartItem.goodsName,
          skuSpecs: null,
          skuSpecString: null,
          price,
          quantity: cartItem.quantity,
          subtotal,
          image: cartItem.coverImage,
        });

        stockCheckItems.push({
          goodsId: goods.id,
          skuId: cartItem.skuId || undefined,
          quantity: cartItem.quantity,
        });
      }
    }

    if (orderItems.length === 0) {
      throw new CoolCommException('商品已全部下架');
    }

    const freightAmount = 0;
    let discountAmount = 0;
    let usedCoupon = null;

    if (couponId) {
      usedCoupon = await this.couponUserRepo.findOne({
        where: { id: Equal(couponId), userId: Equal(userId), orderId: IsNull() },
      });

      if (!usedCoupon) {
        throw new CoolCommException('优惠券无效');
      }

      const coupon = await this.couponRepo.findOneBy({ id: usedCoupon.couponId });
      if (!coupon) {
        throw new CoolCommException('优惠券无效');
      }

      if (coupon.type === 1) {
        discountAmount = coupon.value;
      } else if (coupon.type === 2) {
        discountAmount = Math.floor(totalAmount * (1 - coupon.value / 100));
      } else if (coupon.type === 3) {
        discountAmount = coupon.value;
      }

      if (coupon.minAmount && totalAmount < coupon.minAmount) {
        throw new CoolCommException(
          `使用优惠券需要满 ${this.fenToYuan(coupon.minAmount)} 元`
        );
      }

      discountAmount = Math.min(discountAmount, totalAmount);
    }

    const payAmount = Math.max(0, totalAmount + freightAmount - discountAmount);

    const order = new ShopOrderEntity();
    order.orderNo = this.generateOrderNo();
    order.userId = userId;
    order.totalAmount = totalAmount;
    order.freightAmount = freightAmount;
    order.discountAmount = discountAmount;
    order.payAmount = payAmount;
    order.payMethod = null;
    order.payStatus = 0;
    order.orderStatus = 0;
    order.address = address;
    order.remark = remark;
    order.createTimeIdx = order.createTime
      ? order.createTime.toISOString().substring(0, 7)
      : '';

    const savedOrder = await this.orderRepo.save(order);

    for (const item of orderItems) {
      item.orderId = savedOrder.id;
      await this.orderItemRepo.save(item);
    }

    // 扣减库存（问题3：创建订单时扣减库存）
    await this.deductStock(stockCheckItems);

    if (usedCoupon) {
      usedCoupon.orderId = savedOrder.id;
      usedCoupon.useTime = new Date().toISOString();
      usedCoupon.status = 1;
      await this.couponUserRepo.save(usedCoupon);
    }

    if (!isDirect && cartIds && cartIds.length > 0) {
      await this.cartRepo.delete({ id: In(cartIds), userId: Equal(userId) });
    }

    return savedOrder;
  }

  /**
   * 取消订单
   * （问题1：取消订单回退库存、优惠券、钱包余额）
   */
  async cancel(orderNo: string) {
    const userId = this.ctx.user.id;
    const order = await this.orderRepo.findOne({
      where: { orderNo: Equal(orderNo), userId: Equal(userId) },
    });

    if (!order) {
      throw new CoolCommException('订单不存在');
    }

    if (order.orderStatus !== 0) {
      throw new CoolCommException('订单状态不允许取消');
    }

    // 1. 恢复库存
    const orderItems = await this.orderItemRepo.find({
      where: { orderId: Equal(order.id) },
    });
    if (orderItems.length > 0) {
      const stockItems = orderItems.map(item => ({
        goodsId: item.goodsId,
        skuId: item.skuId || undefined,
        quantity: item.quantity,
      }));
      await this.restoreStock(stockItems);
    }

    // 2. 退回优惠券
    if (order.discountAmount > 0) {
      const usedCoupon = await this.couponUserRepo.findOne({
        where: { orderId: Equal(order.id) },
      });
      if (usedCoupon) {
        usedCoupon.orderId = null;
        usedCoupon.status = 0;
        usedCoupon.useTime = null;
        await this.couponUserRepo.save(usedCoupon);
      }
    }

    // 3. 退回钱包余额（余额支付）
    if (order.payMethod === 'balance' && order.payStatus === 1) {
      await this.walletService.refund(userId, order.id, order.payAmount);
    }

    // 4. 更新订单状态
    order.orderStatus = -1;
    order.closeTime = new Date().toISOString();
    await this.orderRepo.save(order);

    return true;
  }

  /**
   * 确认收货
   */
  async confirm(orderNo: string) {
    const order = await this.orderRepo.findOne({
      where: { orderNo: Equal(orderNo), userId: Equal(this.ctx.user.id) },
    });

    if (!order) {
      throw new CoolCommException('订单不存在');
    }

    if (order.orderStatus !== 2) {
      throw new CoolCommException('订单状态不允许确认收货');
    }

    order.orderStatus = 3;
    order.confirmTime = new Date().toISOString();
    await this.orderRepo.save(order);

    return true;
  }

  /**
   * 支付订单
   * （问题4：余额支付事务化，确保钱包扣减和订单更新一致性）
   */
  async pay(orderNo: string, payMethod: string) {
    const userId = this.ctx.user.id;
    const order = await this.orderRepo.findOne({
      where: { orderNo: Equal(orderNo), userId: Equal(userId) },
    });

    if (!order) {
      throw new CoolCommException('订单不存在');
    }

    if (order.payStatus === 1) {
      throw new CoolCommException('订单已支付');
    }

    if (order.orderStatus !== 0) {
      throw new CoolCommException('订单状态异常');
    }

    // 余额支付：使用事务保证钱包扣减和订单更新的一致性
    if (payMethod === 'balance') {
      await this.orderRepo.manager.transaction(async (manager) => {
        // 扣减钱包余额（使用无事务版本，避免嵌套事务）
        await this.walletService.deductNoTx(userId, order.id, order.payAmount, manager);

        // 更新订单状态
        order.payStatus = 1;
        order.orderStatus = 1;
        order.payMethod = payMethod;
        order.payTime = new Date().toISOString();
        await manager.save(order);
      });
    } else {
      // 其他支付方式（微信/支付宝），直接更新订单
      order.payMethod = payMethod;
      order.payStatus = 1;
      order.orderStatus = 1;
      order.payTime = new Date().toISOString();
      await this.orderRepo.save(order);
    }

    return true;
  }

  /**
   * 后台发货
   */
  async ship(id: number) {
    const order = await this.orderRepo.findOneBy({ id: Equal(id) });
    if (!order) {
      throw new CoolCommException('订单不存在');
    }

    if (order.orderStatus !== 1) {
      throw new CoolCommException('订单状态不允许发货');
    }

    order.orderStatus = 2;
    order.shipTime = new Date().toISOString();
    await this.orderRepo.save(order);

    return true;
  }
}
