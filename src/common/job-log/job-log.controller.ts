import { Controller, Get } from '@nestjs/common';
import { JobLogService } from './job-log.service';

@Controller('job-logs')
export class JobLogController {
  constructor(private readonly jobLogService: JobLogService) {}

  @Get()
  findAll() {
    return this.jobLogService.findAll();
  }
}
