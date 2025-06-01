import {
  IsUUID,
  IsString,
  IsNumber,
  IsOptional,
  IsArray,
  IsIn,
} from 'class-validator';

export class UpdateOrderDto {
  @IsOptional()
  @IsString()
  order_number?: string;

  @IsOptional()
  @IsString()
  user_id?: string;

  @IsOptional()
  @IsNumber()
  total_amount?: number;

  @IsOptional()
  @IsNumber()
  quantity?: number;

  @IsOptional()
  @IsNumber()
  discount_amount?: number;

  @IsOptional()
  @IsUUID()
  product_id?: string;

  @IsOptional()
  @IsUUID()
  voucher_id?: string;

  @IsOptional()
  @IsArray()
  @IsUUID('all', { each: true })
  flash_sale_ids?: string[];

  @IsOptional()
  @IsIn([
    'pending',
    'confirmed',
    'processing',
    'completed',
    'failed',
    'cancelled',
  ])
  status?: string;
}
