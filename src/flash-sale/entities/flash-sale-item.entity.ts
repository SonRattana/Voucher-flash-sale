import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';
import { Tenant } from '../../tenant/entities/tenant.entity';
import { FlashSaleCampaign } from './campaign.entity';
import { Product } from '../../product/entities/product.entity';

@Entity('flash_sale_item')
@Index(['tenant'])
@Index(['campaign'])
export class FlashSaleItem {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Tenant, { onDelete: 'CASCADE' })
  tenant: Tenant;

  @ManyToOne(() => FlashSaleCampaign, { onDelete: 'CASCADE' })
  campaign: FlashSaleCampaign;

  @ManyToOne(() => Product, { onDelete: 'CASCADE' })
  product: Product;

  @Column({ type: 'decimal', precision: 15, scale: 2 })
  sale_price: number;

  @Column()
  stock_limit: number;

  @Column({ default: 0 })
  stock_sold: number;

  @Column({ nullable: true })
  per_customer_limit?: number;

  @Column({ length: 50, default: 'active' })
  status: 'active' | 'sold_out' | 'disabled';

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
