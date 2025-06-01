// src/tenant/dto/create-tenant.dto.ts
import {
  IsNotEmpty,
  IsString,
  IsOptional,
  IsEnum,
  IsNumber,
} from 'class-validator';

export class CreateTenantDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  slug: string;

  @IsString()
  @IsNotEmpty()
  api_key: string;

  @IsOptional()
  @IsEnum(['free', 'silver', 'gold', 'enterprise'])
  package_plan?: string;

  @IsOptional()
  settings?: Record<string, any>;

  @IsOptional()
  @IsNumber()
  rate_limit?: number;
}
