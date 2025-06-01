import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  Index,
} from 'typeorm';
import { Tenant } from '../../../tenant/entities/tenant.entity';

@Entity('job_log')
@Index(['tenant', 'status'])
export class JobLog {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Tenant, { onDelete: 'CASCADE' })
  tenant: Tenant;

  @Column({ nullable: true })
  job_id: string;

  @Column()
  queue_name: string;

  @Column()
  job_type: string;

  @Column()
  status: string; // queued, processing, completed, failed

  @Column('jsonb', { nullable: true })
  data: any;

  @Column('jsonb', { nullable: true })
  result: any;

  @Column({ type: 'text', nullable: true })
  error: string;

  @Column({ type: 'timestamp', nullable: true })
  started_at: Date;

  @Column({ type: 'timestamp', nullable: true })
  completed_at: Date;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
