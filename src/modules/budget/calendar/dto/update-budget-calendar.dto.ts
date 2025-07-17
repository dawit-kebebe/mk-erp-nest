import { PartialType } from '@nestjs/mapped-types';
import { CreateBudgetCalendarDto } from './create-budget-calendar.dto';

export class UpdateBudgetCalendarDto extends PartialType(CreateBudgetCalendarDto) {}