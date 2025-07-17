import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsUUID, IsArray, ValidateNested, IsString, MaxLength, IsOptional, IsNumber, Min } from 'class-validator';
import { Type } from 'class-transformer';

class CreateBudgetPlanItemDto {
  @ApiProperty({
    description: 'Unique name of the budget plan item',
    example: 'Office Supplies',
    maxLength: 100
  })
  @IsString()
  @MaxLength(100)
  plan: string;

  @ApiPropertyOptional({
    description: 'Description of the budget plan item',
    example: 'Pens, paper, and other stationery'
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    description: 'Amount for the budget plan item',
    example: 150.50,
    type: Number
  })
  @IsNumber()
  @Min(0)
  amount: number;

  @ApiProperty({
    description: 'Account ID associated with this plan item',
    example: 'c56a4180-65aa-42ec-a945-5fd21dec0538',
    type: String
  })
  @IsUUID()
  accountId: string;
}

export class CreateBudgetPlanDto {
  @ApiProperty({
    description: 'Identifier of the associated budget calendar',
    example: 'd95f88d5-3d48-4a2a-a8d3-4e8f2b5e9f1c'
  })
  @IsUUID()
  calendarId: string;

  @ApiProperty({
    description: 'List of budget plan items',
    type: [CreateBudgetPlanItemDto]
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateBudgetPlanItemDto)
  items: CreateBudgetPlanItemDto[];
}