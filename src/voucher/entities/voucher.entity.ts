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

@Entity()
@Index(['tenant', 'code'], { unique: true })
export class Voucher {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 100 })
  code: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ type: 'varchar', length: 50 })
  type: 'percentage' | 'fixed_amount' | 'free_shipping';

  @Column({ type: 'decimal', precision: 15, scale: 2 })
  amount: number;

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  minimum_order_amount: number;

  @Column({ type: 'int', nullable: true })
  max_uses?: number;

  @Column({ type: 'int', default: 0 })
  used_count: number;

  @Column({ type: 'timestamptz', nullable: true })
  start_date?: Date;

  @Column({ type: 'timestamptz', nullable: true })
  end_date?: Date;

  @Column({ type: 'varchar', length: 50, default: 'draft' })
  status: 'draft' | 'active' | 'expired' | 'archived';

  @Column({ type: 'boolean', default: true })
  is_public: boolean;

  @Column({ type: 'varchar', length: 100, nullable: true })
  user_group?: string;

  @Column({ type: 'text', array: true, default: () => "'{}'" })
  tags: string[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @ManyToOne(() => Tenant, (tenant) => tenant.vouchers, {
    onDelete: 'CASCADE',
  })
  tenant: Tenant;
}
