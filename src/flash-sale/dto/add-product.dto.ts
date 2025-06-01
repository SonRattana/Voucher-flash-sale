import { IsString, IsNumber, IsOptional, IsEnum } from 'class-validator';

export class AddProductDto {
  @IsString()
  campaign_id: string;

  @IsString()
  product_id: string;

  @IsNumber()
  sale_price: number;

  @IsNumber()
  stock_limit: number;

  @IsNumber()
  @IsOptional()
  per_customer_limit?: number;

  @IsEnum(['active', 'sold_out', 'disabled'])
  @IsOptional()
  status?: 'active' | 'sold_out' | 'disabled';
}
