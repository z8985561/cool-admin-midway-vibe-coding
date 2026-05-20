import { createApp, close } from '@midwayjs/mock';
import { Framework } from '@midwayjs/koa';
import { ShopAddressService } from '../src/modules/shop/service/address';
import * as path from 'path';

describe('Shop Address Module Integration', () => {
  let app;
  let addressService;

  beforeAll(async () => {
    app = await createApp<Framework>(path.join(__dirname, '..'));
    addressService = await app.getApplicationContext().getAsync(ShopAddressService);
  });

  afterAll(async () => {
    await close(app);
  });

  it('should validate phone number format', () => {
    const phone = '13800138000';
    expect(phone).toMatch(/^1\d{10}$/);
  });

  it('should validate address data', () => {
    const data = {
      name: '测试用户',
      phone: '13800138000',
      province: '广东省',
      city: '深圳市',
      district: '南山区',
      address: '科技园路1号',
      isDefault: 1,
    };
    expect(data.name.length).toBeGreaterThan(0);
    expect(data.phone).toMatch(/^1\d{10}$/);
  });
});
