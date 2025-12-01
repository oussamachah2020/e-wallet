import { IsNumber, IsPositive, IsOptional, IsString } from 'class-validator';

export class FundWalletDto {
  @IsNumber()
  @IsPositive()
  amount: number;

  @IsOptional()
  @IsString()
  description?: string;
}
