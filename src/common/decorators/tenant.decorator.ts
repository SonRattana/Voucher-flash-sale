import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';
import { Tenant } from '../../tenant/entities/tenant.entity';

export const CurrentTenant = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): Tenant => {
    const request = ctx.switchToHttp().getRequest<Request>();
    if (!request.tenant) {
      throw new Error('Tenant not found in request');
    }
    return request.tenant;
  },
);
