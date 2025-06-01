import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  ManyToOne,
} from 'typeorm';
import { TenantUser } from './tenant-user.entity';
import { FlashSaleCampaign } from '../../flash-sale/entities/campaign.entity';
import { Voucher } from '../../voucher/entities/voucher.entity';
import { Product } from '../../product/entities/product.entity';
import { TenantPackage } from './tenant-package.entity';
@Entity('tenant')
export class Tenant {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'varchar', length: 100, unique: true })
  slug: string;

  @Column({ type: 'varchar', length: 100, unique: true })
  api_key: string;

  @Column({ type: 'varchar', length: 50, default: 'free' })
  package_plan: string;

  @Column({ type: 'jsonb', default: () => `'{}'` })
  settings: Record<string, any>;

  @Column({ type: 'integer', default: 60 })
  rate_limit: number;

  @Column({ type: 'boolean', default: true })
  is_active: boolean;

  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updated_at: Date;

  @OneToMany(() => TenantUser, (user) => user.tenant)
  users: TenantUser[];

  @OneToMany(() => FlashSaleCampaign, (campaign) => campaign.tenant)
  flash_sales: FlashSaleCampaign[];

  @OneToMany(() => Voucher, (voucher) => voucher.tenant)
  vouchers: Voucher[];

  @OneToMany(() => Product, (product) => product.tenant)
  products: Product[];

  @ManyToOne(() => TenantPackage, { nullable: true })
  package?: TenantPackage;
}
