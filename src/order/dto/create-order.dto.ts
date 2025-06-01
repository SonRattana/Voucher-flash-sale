import {
  IsUUID,
  IsString,
  IsNumber,
  IsOptional,
  IsArray,
  IsIn,
} from 'class-validator';

export class CreateOrderDto {
  @IsString()
  order_number: string;

  @IsString()
  user_id: string;

  @IsNumber()
  total_amount: number;

  @IsNumber()
  quantity: number;

  @IsOptional()
  @IsNumber()
  discount_amount?: number;

  @IsUUID()
  product_id: string;

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
