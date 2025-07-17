import { TEntityCrudController } from "@mk/common/utils/shared-crud.controller";
import { Controller, Inject, Param, Post } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { CreateBudgetPlanDto } from "../dto/create-budget-plan.dto";
import { UpdateBudgetPlanDto } from "../dto/update-budget-plan.dto";
import { RespondBudgetPlanDto } from "../dto/respond-budget-plan.dto";
import { BudgetPlan } from "@mk/database/entities/budget-plan.entity";
import { BudgetPlanService } from "../services/budget-plan.service";
import { WorkflowInstance } from "@mk/database/entities/workflow-instance.entity";

@ApiTags('Budget Plan')
@Controller('budget/plan')
export class BudgetPlanController extends TEntityCrudController<BudgetPlan>({
  createDto: CreateBudgetPlanDto,
  updateDto: UpdateBudgetPlanDto,
  responseDto: RespondBudgetPlanDto,
  entityName: "Budget Plan"
}) {
  constructor(
    @Inject() private readonly budgetPlanService: BudgetPlanService
  ) {
    super(budgetPlanService);
  }

  @Post('/submit-for-approval/:id')
  async submitForApproval(@Param('id') id: string): Promise<WorkflowInstance | WorkflowInstance[]> {
    return this.budgetPlanService.submitForApproval(id);
  }

  @Post('/cancel-from-approval/:id')
  async cancelFromApproval(@Param('id') id: string): Promise<void> {
    return this.budgetPlanService.cancelFromApproval(id);
  }
}