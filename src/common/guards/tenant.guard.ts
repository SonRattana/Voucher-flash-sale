import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { TenantRepository } from '../../tenant/tenant.repository';

@Injectable()
export class TenantGuard implements CanActivate {
  constructor(private readonly tenantRepository: TenantRepository) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest<Request>();
    const tenantId = req.headers['x-tenant-id'] as string;

    if (!tenantId) {
      throw new UnauthorizedException('Missing tenantId from request');
    }

    const tenant = await this.tenantRepository.findOneById(tenantId);

    if (!tenant) {
      throw new UnauthorizedException('Invalid or inactive tenant');
    }

    req.tenant = tenant;
    return true;
  }
}
