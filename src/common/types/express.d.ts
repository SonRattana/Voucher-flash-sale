import { Tenant } from '../../tenant/entities/tenant.entity';

declare module 'express' {
  export interface Request {
    tenantId?: string;
    tenant?: Tenant;
  }
}
