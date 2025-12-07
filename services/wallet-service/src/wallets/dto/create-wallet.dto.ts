import { IsUUID, IsOptional, IsEnum } from 'class-validator';

export class CreateWalletDto {
  @IsOptional()
  @IsEnum(['USD', 'EUR', 'GBP'])
  currency?: string;
}
