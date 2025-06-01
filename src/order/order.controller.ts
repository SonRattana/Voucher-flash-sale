import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Delete,
  UseGuards,
  Patch,
} from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { TenantGuard } from '../common/guards/tenant.guard';
import { CurrentTenant } from '../common/decorators/tenant.decorator';
import { Tenant } from '../tenant/entities/tenant.entity';
import { CurrentUser } from '../common/decorators/user.decorator';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { UpdateOrderDto } from './dto/update-order.dto';
import { AblyService } from '../websocket/ably.service';
@UseGuards(TenantGuard)
@Controller('orders')
export class OrderController {
  constructor(
    private readonly orderService: OrderService,
    @InjectQueue('order') private readonly orderQueue: Queue,
    private readonly ablyService: AblyService,
  ) {}

  @Post()
  async create(
    @Body() dto: CreateOrderDto,
    @CurrentTenant() tenant: Tenant,
    @CurrentUser() userId: string,
  ) {
    const order = await this.orderService.create(dto, tenant, userId);

    // 🌀 Gửi vào hàng đợi xử lý async
    await this.orderQueue.add('process-order', {
      tenantId: tenant.id,
      orderId: order.id,
    });
    await this.ablyService.publish(`tenant-${tenant.id}`, 'order.created', {
      orderId: order.id,
      total: order.total_amount,
    });
    console.log('✅ Published to Ably:', {
      tenant: tenant.id,
      orderId: order.id,
    });

    return order;
  }

  @Get()
  findAll(@CurrentTenant() tenant: Tenant) {
    return this.orderService.findAll(tenant);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @CurrentTenant() tenant: Tenant) {
    return this.orderService.findOne(id, tenant);
  }

  @Delete(':id')
  remove(
    @Param('id') id: string,
    @CurrentTenant() tenant: Tenant,
    @CurrentUser() userId: string,
  ) {
    return this.orderService.remove(id, tenant, userId);
  }
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() dto: UpdateOrderDto,
    @CurrentTenant() tenant: Tenant,
    @CurrentUser() userId: string,
  ) {
    return this.orderService.update(id, dto, tenant, userId);
  }
}
