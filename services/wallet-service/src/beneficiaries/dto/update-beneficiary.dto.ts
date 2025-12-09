import { IsString, IsOptional, MaxLength, IsBoolean } from 'class-validator';

export class UpdateBeneficiaryDto {
  @IsString()
  @IsOptional()
  @MaxLength(50)
  nickname?: string;
}
