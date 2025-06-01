import { IsString, IsOptional, IsIn, IsUUID } from 'class-validator';

export class CreateNotificationDto {
  @IsUUID()
  tenantId: string;

  @IsString()
  title: string;

  @IsString()
  message: string;

  @IsIn(['system', 'flash_sale', 'voucher', 'order'])
  type: 'system' | 'flash_sale' | 'voucher' | 'order';

  @IsOptional()
  @IsUUID()
  reference_id?: string;
}
