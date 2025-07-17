import { PartialType } from '@nestjs/mapped-types';
import { CreateBudgetPlanDto } from './create-budget-plan.dto';

export class UpdateBudgetPlanDto extends PartialType(CreateBudgetPlanDto) {}