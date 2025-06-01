// src/order/entities/order.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
} from 'typeorm';
import { Tenant } from '../../tenant/entities/tenant.entity';
import { Product } from '../../product/entities/product.entity';
import { Voucher } from '../../voucher/entities/voucher.entity';

@Entity('order')
export class Order {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true })
  order_number: string;

  @Column()
  user_id: string;

  @Column('decimal', { precision: 15, scale: 2 })
  total_amount: number;

  @Column('int')
  quantity: number;

  @Column('decimal', { precision: 15, scale: 2, default: 0 })
  discount_amount: number;

  @ManyToOne(() => Voucher, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'voucher_id' }) // 👈 nên thêm dòng này
  voucher?: Voucher;

  @Column({ type: 'uuid', nullable: true })
  voucher_id?: string;

  @Column('uuid', { array: true, nullable: true })
  flash_sale_ids?: string[];

  @Column({ default: 'pending' })
  status: string;

  @ManyToOne(() => Tenant, { onDelete: 'CASCADE' })
  tenant: Tenant;

  @ManyToOne(() => Product, { onDelete: 'CASCADE' })
  product: Product;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
