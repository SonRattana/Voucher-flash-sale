import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Delete,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { TenantService } from './tenant.service';
import { CreateTenantDto } from './dto/create-tenant.dto';
import { TenantGuard } from '../common/guards/tenant.guard';

@Controller('tenants')
export class TenantController {
  constructor(private readonly tenantService: TenantService) {}

  @Post()
  create(@Body() dto: CreateTenantDto) {
    return this.tenantService.create(dto);
  }

  @UseGuards(TenantGuard)
  @Get()
  findAll() {
    return this.tenantService.findAll();
  }

  @UseGuards(TenantGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.tenantService.findOne(id);
  }

  @UseGuards(TenantGuard)
  @Patch(':id')
  async update(@Param('id') id: string, @Body() dto: Partial<CreateTenantDto>) {
    console.log('PATCH /tenants/:id called with ID:', id, 'DTO:', dto);
    return this.tenantService.update(id, dto);
  }

  @UseGuards(TenantGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.tenantService.remove(id);
  }
}
