import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JobLog } from './entities/job-log.entity';

@Injectable()
export class JobLogService {
  constructor(
    @InjectRepository(JobLog)
    private readonly jobRepo: Repository<JobLog>,
  ) {}

  createLog(data: Partial<JobLog>) {
    const log = this.jobRepo.create(data);
    return this.jobRepo.save(log);
  }

  updateStatus(id: string, updates: Partial<JobLog>) {
    return this.jobRepo.update(id, updates);
  }

  findAll() {
    return this.jobRepo.find({
      order: { created_at: 'DESC' },
    });
  }
}
