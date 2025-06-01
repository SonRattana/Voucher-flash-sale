import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FlashSaleCampaign } from './entities/campaign.entity';
import { FlashSaleItem } from './entities/flash-sale-item.entity';
import { CreateCampaignDto } from './dto/create-campaign.dto';
import { AddProductDto } from './dto/add-product.dto';
import { Tenant } from '../tenant/entities/tenant.entity';
import { Product } from '../product/entities/product.entity';
import { AuditLogService } from '../audit-log/audit-log.service';
@Injectable()
export class FlashSaleService {
  constructor(
    @InjectRepository(FlashSaleCampaign)
    private readonly campaignRepo: Repository<FlashSaleCampaign>,
    @InjectRepository(FlashSaleItem)
    private readonly itemRepo: Repository<FlashSaleItem>,
    @InjectRepository(Product)
    private readonly productRepo: Repository<Product>,
    private readonly auditLogService: AuditLogService,
  ) {}

  async createCampaign(
    dto: CreateCampaignDto,
    tenant: Tenant,
    userId: string,
  ): Promise<FlashSaleCampaign> {
    const campaign = this.campaignRepo.create({ ...dto, tenant });
    const saved = await this.campaignRepo.save(campaign);
    await this.auditLogService.log({
      tenantId: tenant.id,
      userId,
      action: 'create',
      entityType: 'campaign',
      entityId: saved.id,
      newValue: saved,
    });
    return saved;
  }

  async findAllCampaigns(tenant: Tenant): Promise<FlashSaleCampaign[]> {
    return this.campaignRepo.find({
      where: { tenant: { id: tenant.id } },
      order: { created_at: 'DESC' },
    });
  }

  async findOneCampaign(
    id: string,
    tenant: Tenant,
  ): Promise<FlashSaleCampaign> {
    const campaign = await this.campaignRepo.findOne({
      where: { id, tenant: { id: tenant.id } },
    });
    if (!campaign) {
      throw new NotFoundException(
        `Flash Sale Campaign with ID ${id} not found`,
      );
    }
    return campaign;
  }

  async updateCampaign(
    id: string,
    dto: Partial<CreateCampaignDto>,
    tenant: Tenant,
    userId: string,
  ) {
    const old = await this.findOneCampaign(id, tenant);
    await this.campaignRepo.update(id, dto);
    const updated = await this.findOneCampaign(id, tenant);
    await this.auditLogService.log({
      tenantId: tenant.id,
      userId,
      action: 'update',
      entityType: 'campaign',
      entityId: id,
      oldValue: old,
      newValue: updated,
    });
    return updated;
  }

  async removeCampaign(id: string, tenant: Tenant, userId: string) {
    const old = await this.findOneCampaign(id, tenant);
    await this.campaignRepo.delete(id);
    await this.auditLogService.log({
      tenantId: tenant.id,
      userId,
      action: 'delete',
      entityType: 'campaign',
      entityId: id,
      oldValue: old,
    });
  }

  async addProduct(dto: AddProductDto, tenant: Tenant): Promise<FlashSaleItem> {
    const campaign = await this.campaignRepo.findOne({
      where: { id: dto.campaign_id, tenant: { id: tenant.id } },
    });

    const product = await this.productRepo.findOne({
      where: { id: dto.product_id, tenant: { id: tenant.id } },
    });

    if (!campaign) {
      throw new NotFoundException(
        `Campaign with ID ${dto.campaign_id} not found`,
      );
    }

    if (!product) {
      throw new NotFoundException(
        `Product with ID ${dto.product_id} not found`,
      );
    }

    const item = this.itemRepo.create({
      tenant,
      campaign,
      product,
      sale_price: dto.sale_price,
      stock_limit: dto.stock_limit,
      per_customer_limit: dto.per_customer_limit,
      status: dto.status || 'active',
    });

    return this.itemRepo.save(item);
  }

  async findAllItems(tenant: Tenant): Promise<FlashSaleItem[]> {
    return this.itemRepo.find({
      where: { tenant: { id: tenant.id } },
      order: { created_at: 'DESC' },
      relations: ['campaign', 'product'],
    });
  }

  async findOneItem(id: string, tenant: Tenant): Promise<FlashSaleItem> {
    const item = await this.itemRepo.findOne({
      where: { id, tenant: { id: tenant.id } },
      relations: ['campaign', 'product'],
    });
    if (!item) {
      throw new NotFoundException(`Flash Sale Item with ID ${id} not found`);
    }
    return item;
  }

  async updateItem(
    id: string,
    dto: Partial<AddProductDto>,
    tenant: Tenant,
  ): Promise<FlashSaleItem> {
    await this.findOneItem(id, tenant); // Chỉ kiểm tra tồn tại
    await this.itemRepo.update(id, dto);
    return this.findOneItem(id, tenant);
  }

  async removeItem(id: string, tenant: Tenant): Promise<void> {
    await this.findOneItem(id, tenant); // Chỉ kiểm tra tồn tại
    await this.itemRepo.delete(id);
  }
}
