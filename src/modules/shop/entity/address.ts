import { BaseEntity } from '../../base/entity/base';
import { Column, Entity, Index } from 'typeorm';

/**
 * 收货地址扩展
 */
@Entity('shop_address')
export class ShopAddressEntity extends BaseEntity {
  @Index()
  @Column({ comment: '用户ID' })
  userId: number;

  @Column({ comment: '联系人', length: 30 })
  contact: string;

  @Index()
  @Column({ comment: '手机号', length: 11 })
  phone: string;

  @Column({ comment: '省', length: 30 })
  province: string;

  @Column({ comment: '市', length: 30 })
  city: string;

  @Column({ comment: '区', length: 30 })
  district: string;

  @Column({ comment: '详细地址', length: 200 })
  address: string;

  @Column({ comment: '邮编', length: 10, nullable: true })
  postalCode: string;

  @Column({ comment: '是否默认', default: false })
  isDefault: boolean;

  @Column({ comment: '标签', length: 20, nullable: true })
  tag: string; // 家/公司/学校
}
