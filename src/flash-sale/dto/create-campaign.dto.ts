import { IsString, IsDateString, IsOptional, IsEnum } from 'class-validator';

export class CreateCampaignDto {
  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsDateString()
  start_date: Date;

  @IsDateString()
  end_date: Date;

  @IsEnum(['draft', 'scheduled', 'active', 'ended', 'cancelled'])
  @IsOptional()
  status?: 'draft' | 'scheduled' | 'active' | 'ended' | 'cancelled';

  @IsString()
  @IsOptional()
  category?: string;

  @IsString()
  @IsOptional()
  user_group?: string;

  @IsString()
  @IsOptional()
  banner_url?: string;
}
