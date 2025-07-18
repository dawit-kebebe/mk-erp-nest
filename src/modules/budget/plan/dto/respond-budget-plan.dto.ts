import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsUUID, IsArray, ValidateNested, IsString, MaxLength, IsOptional, IsNumber, Min } from 'class-validator';
import { Expose, Type } from 'class-transformer';

class RespondBudgetPlanItemDto {
  @ApiProperty({
    description: 'Unique name of the budget plan item',
    example: 'Office Supplies',
    maxLength: 100
  })
  @Expose()
  @IsString()
  @MaxLength(100)
  plan: string;

  @ApiPropertyOptional({
    description: 'Description of the budget plan item',
    example: 'Pens, paper, and other stationery'
  })
  @Expose()
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    description: 'Amount for the budget plan item',
    example: 150.50,
    type: Number
  })
  @Expose()
  @IsNumber()
  @Min(0)
  amount: number;

  @ApiProperty({
    description: 'Account ID associated with this plan item',
    example: 'c56a4180-65aa-42ec-a945-5fd21dec0538',
    type: String
  })
  @Expose()
  @IsUUID()
  accountId: string;
}

export class RespondBudgetPlanDto {
  @ApiProperty({
    description: "The unique identifier (UUID) of the Budget Plan.",
    example: "550e8400-e29b-41d4-a716-446655440010",
    required: true,
    type: String,
    format: "uuid",
  })
  @IsUUID()
  @Expose()
  id: string;

  @ApiProperty({
    description: 'Identifier of the associated budget calendar',
    example: 'd95f88d5-3d48-4a2a-a8d3-4e8f2b5e9f1c'
  })
  @Expose()
  @IsUUID()
  calendarId: string;

  @ApiProperty({
    description: 'List of budget plan items',
    type: [RespondBudgetPlanItemDto]
  })
  @Expose()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => RespondBudgetPlanItemDto)
  items: RespondBudgetPlanItemDto[];
}