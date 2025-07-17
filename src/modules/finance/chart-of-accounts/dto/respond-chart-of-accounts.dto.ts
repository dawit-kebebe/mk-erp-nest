import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsUUID, IsString, MaxLength, IsOptional, IsEnum } from 'class-validator';
import { Expose } from 'class-transformer';
import { ACCOUNT_TYPES } from '@mk/common/enum/account-types.enum';

export class RespondChartOfAccountsDto {
  @ApiProperty({
    description: 'Unique identifier (UUID) of the chart of accounts entry',
    example: '550e8400-e29b-41d4-a716-446655440000',
    type: String,
    format: 'uuid'
  })
  @Expose()
  @IsUUID()
  id: string;

  @ApiProperty({
    description: 'Unique account code',
    example: '1000-01',
    type: String
  })
  @Expose()
  @IsString()
  accountCode: string;

  @ApiPropertyOptional({
    description: 'Description for the account',
    example: 'Cash account',
    type: String
  })
  @Expose()
  @IsString()
  @IsOptional()
  @MaxLength(255)
  description?: string;

  @ApiProperty({
    description: 'Type of the account',
    example: ACCOUNT_TYPES.ASSET,
    enum: ACCOUNT_TYPES
  })
  @Expose()
  @IsEnum(ACCOUNT_TYPES)
  accountType: ACCOUNT_TYPES;
}