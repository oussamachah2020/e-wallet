import {
  IsString,
  IsNotEmpty,
  MinLength,
  MaxLength,
  IsOptional,
  IsBoolean,
} from 'class-validator';

export class AddBeneficiaryDto {
  @IsString()
  @IsNotEmpty()
  accountNumber: string;

  @IsString()
  @IsOptional()
  @MaxLength(50)
  nickname?: string; // Optional: "Mom", "John from work"
}
