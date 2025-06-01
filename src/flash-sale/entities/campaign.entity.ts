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

@Entity('flash_sale_campaign')
@Index(['tenant', 'status'])
@Index(['start_date', 'end_date'])
export class FlashSaleCampaign {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 255 })
  name: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ type: 'timestamptz' })
  start_date: Date;

  @Column({ type: 'timestamptz' })
  end_date: Date;

  @Column({ length: 50, default: 'draft' })
  status: 'draft' | 'scheduled' | 'active' | 'ended' | 'cancelled';

  @Column({ length: 100, nullable: true })
  category?: string;

  @Column({ length: 100, nullable: true })
  user_group?: string;

  @Column({ type: 'text', nullable: true })
  banner_url?: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @ManyToOne(() => Tenant, { onDelete: 'CASCADE' })
  tenant: Tenant;
}
