import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
export enum NotificationType {
  SYSTEM = 'system',
  FLASH_SALE = 'flash_sale',
  VOUCHER = 'voucher',
  ORDER = 'order',
}
@Entity('notification')
export class Notification {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  tenant_id: string;

  @Column({ type: 'varchar', length: 255 })
  title: string;

  @Column({ type: 'text' })
  message: string;

  @Column({ type: 'varchar', length: 50 })
  type: 'system' | 'flash_sale' | 'voucher' | 'order';

  @Column({ type: 'text', array: true, default: '{}' })
  target_user_ids: string[];

  @Column({ type: 'uuid', nullable: true })
  reference_id: string | null;

  @Column({ type: 'varchar', length: 50, default: 'pending' })
  status: 'pending' | 'sent' | 'failed';

  @Column({ type: 'timestamptz', default: () => 'NOW()' })
  send_at: Date;

  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updated_at: Date;
}
