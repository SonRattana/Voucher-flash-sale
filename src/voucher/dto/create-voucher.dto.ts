import {
  IsString,
  IsOptional,
  IsEnum,
  IsNumber,
  IsBoolean,
  IsArray,
  IsDateString,
} from 'class-validator';

export class CreateVoucherDto {
  @IsString()
  code: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsEnum(['percentage', 'fixed_amount', 'free_shipping'])
  type: 'percentage' | 'fixed_amount' | 'free_shipping';

  @IsNumber()
  amount: number;

  @IsOptional()
  @IsNumber()
  minimum_order_amount?: number;

  @IsOptional()
  @IsNumber()
  max_uses?: number;

  @IsOptional()
  @IsDateString()
  start_date?: string;

  @IsOptional()
  @IsDateString()
  end_date?: string;

  @IsOptional()
  @IsEnum(['draft', 'active', 'expired', 'archived'])
  status?: 'draft' | 'active' | 'expired' | 'archived';

  @IsOptional()
  @IsBoolean()
  is_public?: boolean;

  @IsOptional()
  @IsString()
  user_group?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];
}
