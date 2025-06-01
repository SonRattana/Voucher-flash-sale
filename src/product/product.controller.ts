import {
  Controller,
  Post,
  Get,
  Param,
  Body,
  UseGuards,
  Patch,
  Delete,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { TenantGuard } from '../common/guards/tenant.guard';
import { CurrentTenant } from '../common/decorators/tenant.decorator';
import { Tenant } from '../tenant/entities/tenant.entity';
import { CurrentUser } from '../common/decorators/user.decorator';

@UseGuards(TenantGuard)
@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  create(
    @Body() dto: CreateProductDto,
    @CurrentTenant() tenant: Tenant,
    @CurrentUser() userId: string,
  ) {
    return this.productService.create(dto, tenant, userId);
  }

  @Get()
  findAll(@CurrentTenant() tenant: Tenant) {
    return this.productService.findAll(tenant);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @CurrentTenant() tenant: Tenant) {
    return this.productService.findOne(id, tenant);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() dto: Partial<CreateProductDto>,
    @CurrentTenant() tenant: Tenant,
    @CurrentUser() userId: string,
  ) {
    return this.productService.update(id, dto, tenant, userId);
  }

  @Delete(':id')
  remove(
    @Param('id') id: string,
    @CurrentTenant() tenant: Tenant,
    @CurrentUser() userId: string,
  ) {
    return this.productService.remove(id, tenant, userId);
  }
}
