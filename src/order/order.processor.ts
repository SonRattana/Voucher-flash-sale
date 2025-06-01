import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { JobLogService } from '../common/job-log/job-log.service';
import { Tenant } from '../tenant/entities/tenant.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from './entities/order.entity';
interface OrderJobData {
  tenantId: string;
  [key: string]: any;
}

@Processor('order')
export class OrderProcessor {
  constructor(
    private readonly jobLogService: JobLogService,
    @InjectRepository(Order)
    private readonly orderRepo: Repository<Order>,
  ) {}

  @Process('process-order')
  async handleOrder(job: Job<OrderJobData>) {
    const tenant = new Tenant();
    tenant.id = job.data.tenantId;

    const log = await this.jobLogService.createLog({
      tenant,
      job_id: String(job.id),
      queue_name: 'order',
      job_type: 'process-order',
      status: 'processing',
      data: job.data,
      started_at: new Date(),
    });

    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      await this.jobLogService.updateStatus(log.id, {
        status: 'completed',
        completed_at: new Date(),
        result: { message: '✅ Order processed' },
      });
      await this.jobLogService.updateStatus(log.id, {
        status: 'completed',
        completed_at: new Date(),
        result: { message: '✅ Order processed' },
      });
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      await this.jobLogService.updateStatus(log.id, {
        status: 'failed',
        error: errorMessage,
        completed_at: new Date(),
      });
    }
  }
}
