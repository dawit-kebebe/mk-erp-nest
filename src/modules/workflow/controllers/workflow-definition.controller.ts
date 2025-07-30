import { RequiredPermissions } from '@mk/common/decorators/RequiredPermission';
import { FEATURES } from '@mk/common/enum/feature.enum';
import { JwtAuthGuard } from '@mk/common/guards/jwt.guard';
import { RoleGuard } from '@mk/common/guards/role.guard';
import { TenancyGuard } from '@mk/common/guards/tenancy.guard';
import { TEntityCrudController } from '@mk/common/utils/shared-crud.controller';
import { WorkflowDefinition } from '@mk/database/entities/workflow-definition.entity';
import { WorkflowStepDefinition } from '@mk/database/entities/workflow-step-definition.entity';
import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateWorkflowDefinitionDto } from '../dto/create-workflow-definition.dto';
import { RespondWorkflowDefinitionDto, RespondWorkflowStepDefinitionDto } from '../dto/respond-workflow-definition.dto';
import { UpdateWorkflowDefinitionDto } from '../dto/update-workflow-definition.dto';
import { WorkflowDefinitionService } from '../services/workflow-definition.service';

@ApiTags('Workflow')
@Controller('workflow-definition')
@UseGuards(JwtAuthGuard, TenancyGuard, RoleGuard)
@RequiredPermissions(FEATURES.WORKFLOW_DEFINITION)
export class WorkflowDefinitionController extends TEntityCrudController<WorkflowDefinition>({
	createDto: CreateWorkflowDefinitionDto,
	updateDto: UpdateWorkflowDefinitionDto,
	responseDto: RespondWorkflowDefinitionDto,
	entityName: "Workflow Definition",
}) {
	constructor(private readonly workflowService: WorkflowDefinitionService) {
		super(workflowService);
	}

	@Get('/step/:stepOrder/:workflowDefinitionId')
	@ApiOperation({ summary: 'Retrieve a specific workflow step by order and workflow definition ID' })
	@ApiParam({ name: 'stepOrder', type: Number, description: 'Sequential order number of the workflow step' })
	@ApiParam({ name: 'workflowDefinitionId', type: String, description: 'UUID of the workflow definition' })
	@ApiResponse({ status: 200, description: 'Workflow step matching the specified order and workflowDefinitionId', type: RespondWorkflowStepDefinitionDto })
	async findStepByOrderAndWorkflowDefinitionId(
		@Param('stepOrder') stepOrder: number,
		@Param('workflowDefinitionId') workflowDefinitionId: string
	): Promise<WorkflowStepDefinition> {
		return this.workflowService.findStepByOrderAndWorkflowDefinitionId(stepOrder, workflowDefinitionId);
	}

	@Get('/steps/:workflowDefinitionId')
	@ApiOperation({ summary: 'Retrieve all workflow steps for a given workflow definition' })
	@ApiParam({ name: 'workflowDefinitionId', type: String, description: 'UUID of the workflow definition' })
	@ApiResponse({ status: 200, description: 'Array of workflow steps for the specified workflowDefinitionId', type: RespondWorkflowStepDefinitionDto, isArray: true })
	async findStepsByWorkflowDefinitionId(@Param('workflowDefinitionId') workflowDefinitionId: string): Promise<WorkflowStepDefinition[]> {
		return this.workflowService.findStepsByWorkflowDefinitionId(workflowDefinitionId);
	}
}
