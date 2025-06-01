import {
  Controller,
  Post,
  Get,
  Body,
  UseGuards,
  Param,
  Patch,
  Delete,
} from '@nestjs/common';
import { VoucherService } from './voucher.service';
import { CreateVoucherDto } from './dto/create-voucher.dto';
import { TenantGuard } from '../common/guards/tenant.guard';
import { CurrentTenant } from '../common/decorators/tenant.decorator';
import { CurrentUser } from '../common/decorators/user.decorator';
import { Tenant } from '../tenant/entities/tenant.entity';

@UseGuards(TenantGuard)
@Controller('vouchers')
export class VoucherController {
  constructor(private readonly voucherService: VoucherService) {}

  @Post()
  create(
    @Body() dto: CreateVoucherDto,
    @CurrentTenant() tenant: Tenant,
    @CurrentUser() userId: string,
  ) {
    return this.voucherService.create(dto, tenant, userId);
  }

  @Get()
  findAll(@CurrentTenant() tenant: Tenant) {
    return this.voucherService.findAll(tenant);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @CurrentTenant() tenant: Tenant) {
    return this.voucherService.findOne(id, tenant);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() dto: Partial<CreateVoucherDto>,
    @CurrentTenant() tenant: Tenant,
    @CurrentUser() userId: string,
  ) {
    return this.voucherService.update(id, dto, tenant, userId);
  }

  @Delete(':id')
  remove(
    @Param('id') id: string,
    @CurrentTenant() tenant: Tenant,
    @CurrentUser() userId: string,
  ) {
    return this.voucherService.remove(id, tenant, userId);
  }
}
