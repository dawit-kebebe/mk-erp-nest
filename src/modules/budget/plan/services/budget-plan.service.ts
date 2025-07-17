import { OrganizationalUnitContext } from '@mk/common/contexts/organizational-unit.context';
import { TenantContext } from '@mk/common/contexts/tenant.context';
import { UserContext } from '@mk/common/contexts/user.context';
import { FEATURES } from '@mk/common/enum/feature.enum';
import { WORKFLOW_STATUS } from '@mk/common/enum/workflow-status.enum';
import { TEntityCrudService } from '@mk/common/utils/shared-crud.service';
import { BudgetPlan, BudgetPlanItem } from '@mk/database/entities/budget-plan.entity';
import { WorkflowInstance } from '@mk/database/entities/workflow-instance.entity';
import { CreateWorkflowInstanceDto } from '@mk/modules/workflow/dto/create-workflow-instance.dto';
import { WorkflowDefinitionService } from '@mk/modules/workflow/services/workflow-definition.service';
import { WorkflowInstanceService } from '@mk/modules/workflow/services/workflow-intance.service';
import { BadRequestException, ForbiddenException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { isUUID } from 'class-validator';
import { Repository } from 'typeorm';
import { CreateBudgetPlanDto } from '../dto/create-budget-plan.dto';
import { UpdateBudgetPlanDto } from '../dto/update-budget-plan.dto';

@Injectable()
export class BudgetPlanService extends TEntityCrudService<BudgetPlan> {
	constructor(
		@InjectRepository(BudgetPlan) private readonly budgetPlanRepository: Repository<BudgetPlan>,
		@InjectRepository(BudgetPlanItem) private readonly itemRepository: Repository<BudgetPlanItem>,

		@Inject() private readonly workflowDefinitionService: WorkflowDefinitionService,
		@Inject() private readonly workflowInstanceService: WorkflowInstanceService,

		@Inject() readonly tenantContext: TenantContext,
		@Inject() private readonly organizationalUnitContext: OrganizationalUnitContext,
		@Inject() private readonly userContext: UserContext
	) {
		super(budgetPlanRepository, tenantContext);
	}

	async create(dto: CreateBudgetPlanDto): Promise<BudgetPlan> {
		const tenantId = this.tenantContext.tenantId;
		const organizationalUnitId = this.organizationalUnitContext.organizationalUnitId;

		if (!isUUID(tenantId) || !isUUID(organizationalUnitId)) {
			throw new ForbiddenException('Tenant or Organizational Unit ID missing from context.');
		}

		if (!isUUID(dto.calendarId)) {
			throw new BadRequestException('Invalid calendar ID format.');
		}

		return this.budgetPlanRepository.manager.transaction(async (manager) => {
			const plan = manager.create(BudgetPlan, {
				calendarId: dto.calendarId,
				tenantId,
				organizationalUnitId,
			});

			const savedPlan = await manager.save(plan);

			const items = dto.items.map((item) =>
				manager.create(BudgetPlanItem, {
					plan: item.plan,
					description: item.description,
					amount: item.amount,
					accountId: item.accountId,
					budgetPlanId: savedPlan.id,
				}),
			);

			const savedItems = await manager.save(BudgetPlanItem, items);
			savedPlan.items = savedItems;
			return savedPlan;
		});
	}

	async update(id: string, dto: UpdateBudgetPlanDto): Promise<BudgetPlan> {
		const tenantId = this.tenantContext.tenantId;
		const organizationalUnitId = this.organizationalUnitContext.organizationalUnitId;

		if (!isUUID(tenantId) || !isUUID(organizationalUnitId)) {
			throw new ForbiddenException('Tenant or Organizational Unit ID missing from context.');
		}

		if (!isUUID(id)) {
			throw new BadRequestException('Invalid ID format.');
		}

		return this.budgetPlanRepository.manager.transaction(async (manager) => {
			const existing = await manager.findOne(BudgetPlan, { where: { id, tenantId } });
			if (!existing) {
				throw new BadRequestException('Budget plan not found.');
			}

			if (dto.calendarId && !isUUID(dto.calendarId)) {
				throw new BadRequestException('Invalid calendar ID format.');
			}

			Object.assign(existing, {
				calendarId: dto.calendarId ?? existing.calendarId,
			});

			const updatedPlan = await manager.save(existing);

			if (dto.items) {
				await manager.delete(BudgetPlanItem, { budgetPlanId: id });
				const newItems = dto.items.map((item) =>
					manager.create(BudgetPlanItem, {
						plan: item.plan,
						description: item.description,
						amount: item.amount,
						accountId: item.accountId,
						budgetPlanId: id,
					}),
				);
				const savedItems = await manager.save(BudgetPlanItem, newItems);
				updatedPlan.items = savedItems;
			}

			return updatedPlan;
		});
	}

	async submitForApproval(id: string): Promise<WorkflowInstance | WorkflowInstance[]> {
		const tenantId = this.tenantContext.tenantId;
		const organizationalUnitId = this.organizationalUnitContext.organizationalUnitId;
		const userId = this.userContext.userId;

		if (!isUUID(tenantId) || !isUUID(organizationalUnitId) || !isUUID(userId)) {
			throw new ForbiddenException('Tenant, Organizational Unit or User ID missing from context.');
		}

		if (!isUUID(id)) {
			throw new BadRequestException('Invalid ID format.');
		}

		const workflowDefinition = await this.workflowDefinitionService.findByFeature(FEATURES.BUDGET_PLAN);
		if (!workflowDefinition) {
			throw new NotFoundException('Workflow definition for budget plan not found.');
		}

		const inWorkflow = await this.workflowInstanceService.findByIdAndWorkflowType(id, FEATURES.BUDGET_PLAN);
		if (inWorkflow) {
			if (inWorkflow.status === WORKFLOW_STATUS.IN_PROGRESS) {
				throw new BadRequestException(`Budget plan is already in workflow and the status is "in progress".`);
			}

			if (inWorkflow.status === WORKFLOW_STATUS.CANCELLED || inWorkflow.status === WORKFLOW_STATUS.REJECTED) {
				throw new BadRequestException(`Budget plan is rejected or cancelled, please submit another draft.`);
			}
		}

		const workflowInstance = new CreateWorkflowInstanceDto();
		workflowInstance.workflowDefinitionId = workflowDefinition.id;
		workflowInstance.entityId = id;
		workflowInstance.entityType = FEATURES.BUDGET_PLAN;
		workflowInstance.submissionDate = new Date();
		workflowInstance.submittedByUserId = userId;
		workflowInstance.status = WORKFLOW_STATUS.IN_PROGRESS;

		const createdInstance = await this.workflowInstanceService.create(workflowInstance);
		if (!createdInstance) {
			throw new BadRequestException('Failed to create workflow instance for budget plan.');
		}

		return createdInstance;
	}

	async cancelFromApproval(id: string) {
		const tenantId = this.tenantContext.tenantId;
		const organizationalUnitId = this.organizationalUnitContext.organizationalUnitId;
		const userId = this.userContext.userId;

		if (!isUUID(tenantId) || !isUUID(organizationalUnitId) || !isUUID(userId)) {
			throw new ForbiddenException('Tenant, Organizational Unit or User ID missing from context.');
		}

		if (!isUUID(id)) {
			throw new BadRequestException('Invalid ID format.');
		}

		const inWorkflow = await this.workflowInstanceService.findByIdAndWorkflowType(id, FEATURES.BUDGET_PLAN);
		if (inWorkflow) {
			if (inWorkflow.status === WORKFLOW_STATUS.CANCELLED || inWorkflow.status === WORKFLOW_STATUS.REJECTED) {
				throw new BadRequestException(`Budget plan is already rejected or cancelled.`);
			}

			const workflowDefinition = this.workflowDefinitionService.findOne(inWorkflow.workflowDefinitionId)
			if (!workflowDefinition) {
				throw new NotFoundException('Workflow definition for budget plan not found.');
			}

			if (inWorkflow.submittedByUserId !== userId) {
				throw new ForbiddenException('Only the user who submitted the budget plan can cancel it.');
			}

		}else if (!inWorkflow) {
			throw new NotFoundException(`Budget plan with ID ${id} is not in workflow.`);
		}

		this.workflowInstanceService.cancelWorkflowInstance(inWorkflow.id)
	}
}