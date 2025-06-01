import { Injectable } from '@nestjs/common';
import { ThrottlerGuard } from '@nestjs/throttler';

@Injectable()
export class TenantThrottlerGuard extends ThrottlerGuard {
  protected async getTracker(req: {
    headers: Record<string, string | string[] | undefined>;
    ip: string;
  }): Promise<string> {
    const tenantId = req.headers['x-tenant-id'];
    if (Array.isArray(tenantId)) {
      return Promise.resolve(tenantId[0] || req.ip);
    }
    return Promise.resolve(tenantId || req.ip);
  }
}
