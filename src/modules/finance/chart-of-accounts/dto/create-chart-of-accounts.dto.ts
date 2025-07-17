import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNotEmpty, MaxLength, IsOptional, IsEnum } from 'class-validator';
import { ACCOUNT_TYPES } from '@mk/common/enum/account-types.enum';

export class CreateChartOfAccountsDto {
  @ApiProperty({
    description: 'Unique account code',
    example: '1000-01',
    type: String,
  })
  @IsString()
  @IsNotEmpty()
  accountCode: string;

  @ApiPropertyOptional({
    description: 'Description for the account',
    example: 'Cash account',
    type: String,
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    description: 'Type of the account',
    example: ACCOUNT_TYPES.ASSET,
    enum: ACCOUNT_TYPES,
  })
  @IsEnum(ACCOUNT_TYPES)
  accountType: ACCOUNT_TYPES;
}