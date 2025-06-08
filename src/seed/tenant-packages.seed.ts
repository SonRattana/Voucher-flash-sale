import { DataSource } from 'typeorm';
import { TenantPackage } from '../tenant/entities/tenant-package.entity';

export async function seedTenantPackages(dataSource: DataSource) {
  const repo = dataSource.getRepository(TenantPackage);
  const count = await repo.count();
  if (count > 0) return;

  await repo.insert([
    {
      name: 'Free',
      max_products: 10,
      max_vouchers: 20,
      max_flash_sales: 5,
      support_realtime_tracking: false,
      support_schedule: false,
      support_dashboard: false,
    },
    {
      name: 'Silver',
      max_products: 100,
      max_vouchers: 200,
      max_flash_sales: 20,
      support_realtime_tracking: true,
      support_schedule: true,
      support_dashboard: false,
    },
    {
      name: 'Gold',
      max_products: 500,
      max_vouchers: 2000,
      max_flash_sales: 100,
      support_realtime_tracking: true,
      support_schedule: true,
      support_dashboard: true,
    },
    {
      name: 'Enterprise',
      max_products: -1, // Không giới hạn
      max_vouchers: -1, // Không giới hạn
      max_flash_sales: -1, // Không giới hạn
      support_realtime_tracking: true,
      support_schedule: true,
      support_dashboard: true,
    },
  ]);

  console.log('✅ Seeded tenant_package');
}
