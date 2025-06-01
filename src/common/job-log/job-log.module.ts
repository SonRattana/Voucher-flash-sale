import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JobLog } from './entities/job-log.entity';
import { JobLogService } from './job-log.service';
import { JobLogController } from './job-log.controller';
import { JobProcessor } from './job.processor';
import { BullModule } from '@nestjs/bull';

@Module({
  imports: [
    TypeOrmModule.forFeature([JobLog]),
    BullModule.registerQueue({
      name: 'job-queue',
    }),
  ],
  controllers: [JobLogController],
  providers: [JobLogService, JobProcessor],
  exports: [JobLogService],
})
export class JobLogModule {}
