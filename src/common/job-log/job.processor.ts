import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { JobLogService } from './job-log.service';
import { Tenant } from '../../tenant/entities/tenant.entity';

interface GenericJobData {
  tenantId: string;
  [key: string]: any;
}

@Processor('job-queue')
export class JobProcessor {
  constructor(private readonly jobLogService: JobLogService) {}

  @Process('process-order')
  async handleOrder(job: Job<GenericJobData>) {
    const tenant = new Tenant();
    tenant.id = job.data.tenantId;

    const log = await this.jobLogService.createLog({
      tenant,
      job_id: String(job.id),
      queue_name: 'job-queue',
      job_type: 'process-order',
      status: 'processing',
      data: job.data,
      started_at: new Date(),
    });

    try {
      console.log('⏳ Processing job:', job.data);
      await new Promise((resolve) => setTimeout(resolve, 1000));

      await this.jobLogService.updateStatus(log.id, {
        status: 'completed',
        completed_at: new Date(),
        result: { message: '✅ Job done' },
      });
    } catch (error: unknown) {
      let errorMessage = 'Unknown error';
      if (error instanceof Error) {
        errorMessage = error.message;
      } else if (typeof error === 'string') {
        errorMessage = error;
      }
      await this.jobLogService.updateStatus(log.id, {
        status: 'failed',
        error: errorMessage,
        completed_at: new Date(),
      });
    }
  }
}
