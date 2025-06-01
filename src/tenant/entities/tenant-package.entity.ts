import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('tenant_package')
export class TenantPackage {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 100 })
  name: string;

  @Column({ default: 0 })
  max_products: number;

  @Column({ default: 0 })
  max_vouchers: number;

  @Column({ default: 0 })
  max_flash_sales: number;

  @Column({ default: false })
  support_realtime_tracking: boolean;

  @Column({ default: false })
  support_schedule: boolean;

  @Column({ default: false })
  support_dashboard: boolean;
  @UpdateDateColumn()
  updated_at: Date;

  @CreateDateColumn()
  created_at: Date;
}
