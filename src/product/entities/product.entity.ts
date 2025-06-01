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

@Entity('product')
@Index(['tenant'])
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Tenant, (tenant) => tenant.products, {
    onDelete: 'CASCADE',
  })
  tenant: Tenant;

  @Column({ length: 255 })
  name: string;

  @Column({ length: 100, nullable: true })
  sku?: string;

  @Column({ type: 'decimal', precision: 15, scale: 2 })
  regular_price: number;

  @Column({ default: 0 })
  stock_quantity: number;

  @Column({ length: 100, nullable: true })
  category?: string;

  @Column({ type: 'text', nullable: true })
  image_url?: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ length: 50, default: 'active' })
  status: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
