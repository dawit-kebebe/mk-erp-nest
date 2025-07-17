import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, MaxLength, IsDateString, IsEnum } from 'class-validator';
import { BUDGET_CALENDAR_STATUS } from '@mk/common/enum/budget-calendar-status.enum';
import { Expose } from 'class-transformer';

export class RespondBudgetCalendarDto {
  @ApiProperty({
    description: 'Unique name of the budget calendar',
    example: 'FY2023-Q1',
    maxLength: 50
  })
  @Expose()
  @IsString()
  @MaxLength(50)
  name: string;

  @ApiPropertyOptional({
    description: 'Detailed description for the budget calendar',
    example: 'Budget calendar for first quarter of 2023'
  })
  @Expose()
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({
    description: 'Start date of the budget calendar period',
    example: '2023-01-01T00:00:00Z',
    type: String
  })
  @Expose()
  @IsDateString()
  from: string;

  @ApiPropertyOptional({
    description: 'End date of the budget calendar period',
    example: '2023-03-31T23:59:59Z',
    type: String
  })
  @Expose()
  @IsDateString()
  to: string;

  @ApiPropertyOptional({
    description: 'Current status of the budget calendar',
    example: BUDGET_CALENDAR_STATUS.OPEN,
    enum: BUDGET_CALENDAR_STATUS
  })
  @Expose()
  @IsEnum(BUDGET_CALENDAR_STATUS)
  status: BUDGET_CALENDAR_STATUS;
}