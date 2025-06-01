import {
  Controller,
  Post,
  Get,
  Patch,
  Delete,
  Param,
  Body,
  UseGuards,
} from '@nestjs/common';
import { FlashSaleService } from './flash-sale.service';
import { CreateCampaignDto } from './dto/create-campaign.dto';
import { AddProductDto } from './dto/add-product.dto';
import { TenantGuard } from '../common/guards/tenant.guard';
import { CurrentTenant } from '../common/decorators/tenant.decorator';
import { Tenant } from '../tenant/entities/tenant.entity';
import { CurrentUser } from '../common/decorators/user.decorator';
@UseGuards(TenantGuard)
@Controller('flash-sales')
export class FlashSaleController {
  constructor(private readonly flashSaleService: FlashSaleService) {}

  @Post('campaigns')
  createCampaign(
    @Body() dto: CreateCampaignDto,
    @CurrentTenant() tenant: Tenant,
    @CurrentUser() userId: string,
  ) {
    return this.flashSaleService.createCampaign(dto, tenant, userId);
  }

  @Get('campaigns')
  findAllCampaigns(@CurrentTenant() tenant: Tenant) {
    return this.flashSaleService.findAllCampaigns(tenant);
  }

  @Get('campaigns/:id')
  findOneCampaign(@Param('id') id: string, @CurrentTenant() tenant: Tenant) {
    return this.flashSaleService.findOneCampaign(id, tenant);
  }

  @Patch('campaigns/:id')
  updateCampaign(
    @Param('id') id: string,
    @Body() dto: Partial<CreateCampaignDto>,
    @CurrentTenant() tenant: Tenant,
    @CurrentUser() userId: string,
  ) {
    return this.flashSaleService.updateCampaign(id, dto, tenant, userId);
  }

  @Delete('campaigns/:id')
  removeCampaign(
    @Param('id') id: string,
    @CurrentTenant() tenant: Tenant,
    @CurrentUser() userId: string,
  ) {
    return this.flashSaleService.removeCampaign(id, tenant, userId);
  }

  @Post('items')
  addProduct(@Body() dto: AddProductDto, @CurrentTenant() tenant: Tenant) {
    return this.flashSaleService.addProduct(dto, tenant);
  }

  @Get('items')
  findAllItems(@CurrentTenant() tenant: Tenant) {
    return this.flashSaleService.findAllItems(tenant);
  }

  @Get('items/:id')
  findOneItem(@Param('id') id: string, @CurrentTenant() tenant: Tenant) {
    return this.flashSaleService.findOneItem(id, tenant);
  }

  @Patch('items/:id')
  updateItem(
    @Param('id') id: string,
    @Body() dto: Partial<AddProductDto>,
    @CurrentTenant() tenant: Tenant,
  ) {
    return this.flashSaleService.updateItem(id, dto, tenant);
  }

  @Delete('items/:id')
  removeItem(@Param('id') id: string, @CurrentTenant() tenant: Tenant) {
    return this.flashSaleService.removeItem(id, tenant);
  }
}
