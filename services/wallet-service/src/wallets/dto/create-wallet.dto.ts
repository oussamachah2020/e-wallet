import { IsUUID, IsOptional, IsEnum } from 'class-validator';

export class CreateWalletDto {
  @IsUUID()
  userId: string;

  @IsOptional()
  @IsEnum(['USD', 'EUR', 'GBP'])
  currency?: string;
}
