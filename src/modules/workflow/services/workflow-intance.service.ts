import { TenantContext } from "@mk/common/contexts/tenant.context";
import { UserContext } from "@mk/common/contexts/user.context";
import { APPROVAL_STRATEGY } from "@mk/common/enum/approval-strategy.enum";
import { WORKFLOW_STATUS } from "@mk/common/enum/workflow-status.enum";
import { WORKFLOW_TASK } from "@mk/common/enum/workflow-task.enum";
import { TEntityCrudService } from "@mk/common/utils/shared-crud.service";
import { User } from "@mk/database/entities/user.entity";
import { WorkflowInstance } from "@mk/database/entities/workflow-instance.entity";
import { WorkflowTask } from "@mk/database/entities/workflow-task.entity";
import { BadRequestException, ForbiddenException, Inject, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { isUUID } from "class-validator";
import { Repository } from "typeorm";
import { CreateWorkflowInstanceDto } from "../dto/create-workflow-instance.dto";
import { FEATURES } from "@mk/common/enum/feature.enum";

@Injectable()
export class WorkflowInstanceService extends TEntityCrudService<WorkflowInstance> {
    constructor(
        @InjectRepository(WorkflowInstance) private readonly workflowInstanceRepository: Repository<WorkflowInstance>,
        @Inject() readonly tenantContext: TenantContext,
        @Inject() private readonly userContext: UserContext
    ) {
        super(workflowInstanceRepository, tenantContext);
    }

    async create(itemData: CreateWorkflowInstanceDto): Promise<WorkflowInstance | WorkflowInstance[]> {
        const tenantId = this.tenantContext.tenantId;
        if (!isUUID(tenantId)) {
            throw new ForbiddenException('Tenant ID is missing from context.');
        }

        return await this.workflowInstanceRepository.manager.transaction(async (entityManager) => {
            const workflowInstance = entityManager.create(WorkflowInstance, { ...itemData });
            let savedWorkflowInstance = await entityManager.save(WorkflowInstance, workflowInstance);

            if (savedWorkflowInstance.workflowDefinition.tenantId !== tenantId) {
                throw new ForbiddenException('You do not have permission to create a workflow instance for this workflow definition.');
            }

            const workflowStep = savedWorkflowInstance.workflowDefinition.steps.find(step => step.stepOrder === 1);

            if (!workflowStep) {
                throw new ForbiddenException('Workflow definition must have a first step defined.');
            }

            savedWorkflowInstance.status = WORKFLOW_STATUS.IN_PROGRESS;
            savedWorkflowInstance.currentStepId = workflowStep.id;
            savedWorkflowInstance.tenantId = savedWorkflowInstance.workflowDefinition.tenantId;
            return await entityManager.save(WorkflowInstance, savedWorkflowInstance);
        });
    }

    update(id: string, itemData: any): Promise<WorkflowInstance> {
        throw new BadRequestException("cannot update workflow instance directly, use specific methods for updating workflow steps or tasks.");
    }

    async findByIdAndWorkflowType(entityId: string, workflowType: FEATURES): Promise<WorkflowInstance | null> {
        const tenantId = this.tenantContext.tenantId;
        if (!isUUID(tenantId)) {
            throw new ForbiddenException('Tenant ID is missing from context.');
        }

        if (!isUUID(entityId)) {
            throw new BadRequestException('Invalid ID format.');
        }

        return await this.workflowInstanceRepository.findOne({
            where: { entityId, tenantId, entityType: workflowType },
            relations: ['workflowDefinition', 'currentStep', 'currentStep.requiredRoles']
        });
    }

    async approveWorkflowInstance(instanceId: string, message?: string): Promise<WorkflowInstance> {
        const tenantId = this.tenantContext.tenantId;
        if (!isUUID(tenantId)) {
            throw new ForbiddenException('Tenant ID is missing from context.');
        }

        return await this.workflowInstanceRepository.manager.transaction(async (entityManager) => {
            // load user
            const user = await entityManager.findOne(User, { where: { id: this.userContext.userId, tenantId }, relations: ['role'] });
            if (!user) {
                throw new ForbiddenException('User not found or does not have permission to approve this workflow instance.');
            }
            if (!user.role) {
                throw new ForbiddenException('User does not have a role assigned and cannot approve this workflow instance.');
            }

            // load instance with needed relations
            const instance = await entityManager.findOne(WorkflowInstance, {
                where: { id: instanceId, tenantId },
                relations: [
                    'workflowDefinition',
                    'workflowDefinition.steps',
                    'workflowDefinition.steps.requiredRoles',
                    'currentStep',
                    'currentStep.requiredRoles',
                    'tasks'
                ]
            });
            if (!instance) {
                throw new BadRequestException('Workflow instance not found.');
            }
            if ([WORKFLOW_STATUS.COMPLETED, WORKFLOW_STATUS.CANCELLED, WORKFLOW_STATUS.REJECTED].includes(instance.status)) {
                throw new BadRequestException(`Workflow instance cannot be approved in its current status: ${instance.status}`);
            }

            const currentStepDef = instance.workflowDefinition.steps.find(s => s.id === instance.currentStepId);
            const nextStepDef = instance.workflowDefinition.steps.find(s => s.stepOrder === (currentStepDef?.stepOrder || 0) + 1);

            if (!currentStepDef || !instance.currentStep) {
                throw new BadRequestException('Workflow instance does not have a current step.');
            }
            if (!currentStepDef.requiredRoles?.length) {
                throw new BadRequestException('Current step does not have any required roles defined.');
            }
            const hasRole = currentStepDef.requiredRoles.some(r => r.id === user.role!.id);
            if (!hasRole) {
                throw new ForbiddenException('User does not have the required role to approve this workflow instance.');
            }

            // count existing approvals for this step
            const existingCount = await entityManager.count(WorkflowTask, {
                where: {
                    workflowInstanceId: instance.id,
                    workflowStepDefinitionId: instance.currentStepId,
                    status: WORKFLOW_TASK.APPROVE
                }
            });
            // prevent duplicate role approval
            const duplicate = await entityManager.findOne(WorkflowTask, {
                where: {
                    workflowInstanceId: instance.id,
                    workflowStepDefinitionId: instance.currentStepId,
                    actedByRoleId: user.role.id,
                    status: WORKFLOW_TASK.APPROVE
                }
            });
            if (duplicate) {
                throw new ForbiddenException('User has already approved this workflow step.');
            }

            // create and save new task
            const taskEntity = entityManager.create(WorkflowTask, {
                workflowInstanceId: instance.id,
                workflowStepDefinitionId: instance.currentStepId,
                actedByUserId: this.userContext.userId,
                actedByRoleId: user.role.id,
                status: WORKFLOW_TASK.APPROVE,
                comments: message || 'Approved'
            });
            await entityManager.save(WorkflowTask, taskEntity);

            // update instance state based on strategy
            switch (currentStepDef.approvalStrategy) {
                case APPROVAL_STRATEGY.ONE_OF_MANY:
                    if (!nextStepDef) {
                        instance.status = WORKFLOW_STATUS.COMPLETED;
                        instance.completionDate = new Date();
                    } else {
                        instance.currentStepId = nextStepDef.id;
                        instance.currentStep = nextStepDef;
                    }
                    break;
                case APPROVAL_STRATEGY.ALL_MUST_APPROVE:
                    if (existingCount + 1 >= currentStepDef.requiredRoles.length) {
                        if (!nextStepDef) {
                            instance.status = WORKFLOW_STATUS.COMPLETED;
                            instance.completionDate = new Date();
                        } else {
                            instance.currentStepId = nextStepDef.id;
                            instance.currentStep = nextStepDef;
                        }
                    }
                    break;
                case APPROVAL_STRATEGY.MAJORITY:
                    const needed = Math.ceil(currentStepDef.requiredRoles.length / 2);
                    if (existingCount + 1 >= needed) {
                        if (!nextStepDef) {
                            instance.status = WORKFLOW_STATUS.COMPLETED;
                            instance.completionDate = new Date();
                        } else {
                            instance.currentStepId = nextStepDef.id;
                            instance.currentStep = nextStepDef;
                        }
                    }
                    break;
                default:
                    break;
            }

            // persist instance changes
            await entityManager.save(WorkflowInstance, instance);
            return instance;
        });
    }

    async rejectWorkflowInstance(instanceId: string, message?: string): Promise<WorkflowInstance> {
        const tenantId = this.tenantContext.tenantId;
        if (!isUUID(tenantId)) {
            throw new ForbiddenException('Tenant ID is missing from context.');
        }
        return await this.workflowInstanceRepository.manager.transaction(async (entityManager) => {
            const user = await entityManager.findOne(User, { where: { id: this.userContext.userId, tenantId }, relations: ['role'] });
            if (!user) {
                throw new ForbiddenException('User not found or does not have permission to reject this workflow instance.');
            }
            if (!user.role) {
                throw new ForbiddenException('User does not have a role assigned and cannot reject this workflow instance.');
            }
            const instance = await entityManager.findOne(WorkflowInstance, {
                where: { id: instanceId, tenantId },
                relations: [
                    'workflowDefinition',
                    'workflowDefinition.steps',
                    'workflowDefinition.steps.requiredRoles',
                    'currentStep',
                    'currentStep.requiredRoles'
                ]
            });
            if (!instance) {
                throw new BadRequestException('Workflow instance not found.');
            }
            if ([WORKFLOW_STATUS.COMPLETED, WORKFLOW_STATUS.CANCELLED, WORKFLOW_STATUS.REJECTED].includes(instance.status)) {
                throw new BadRequestException(`Workflow instance cannot be rejected in its current status: ${instance.status}`);
            }
            const currentStepDef = instance.workflowDefinition.steps.find(s => s.id === instance.currentStepId);
            if (!currentStepDef || !instance.currentStep) {
                throw new BadRequestException('Workflow instance does not have a current step.');
            }
            if (!currentStepDef.requiredRoles?.length) {
                throw new BadRequestException('Current step does not have any required roles defined.');
            }
            const hasRole = currentStepDef.requiredRoles.some(r => r.id === user.role!.id);
            if (!hasRole) {
                throw new ForbiddenException('User does not have the required role to reject this workflow instance.');
            }
            const taskEntity = entityManager.create(WorkflowTask, {
                workflowInstanceId: instance.id,
                workflowStepDefinitionId: instance.currentStepId,
                actedByUserId: this.userContext.userId,
                actedByRoleId: user.role.id,
                status: WORKFLOW_TASK.REJECT,
                comments: message || 'Rejected'
            });
            await entityManager.save(WorkflowTask, taskEntity);
            instance.status = WORKFLOW_STATUS.REJECTED;
            instance.completionDate = new Date();
            await entityManager.save(WorkflowInstance, instance);
            return instance;
        });
    }

    async cancelWorkflowInstance(instanceId: string, message?: string): Promise<WorkflowInstance> {
        const tenantId = this.tenantContext.tenantId;
        if (!isUUID(tenantId)) {
            throw new ForbiddenException('Tenant ID is missing from context.');
        }
        
        return await this.workflowInstanceRepository.manager.transaction(async (entityManager) => {
            const user = await entityManager.findOne(User, { where: { id: this.userContext.userId, tenantId }, relations: ['role'] });
            if (!user) {
                throw new ForbiddenException('User not found or does not have permission to cancel this workflow instance.');
            }
            if (!user.role) {
                throw new ForbiddenException('User does not have a role assigned and cannot cancel this workflow instance.');
            }
            const instance = await entityManager.findOne(WorkflowInstance, {
                where: { id: instanceId, tenantId },
                relations: [
                    'workflowDefinition',
                    'workflowDefinition.steps',
                    'workflowDefinition.steps.requiredRoles',
                    'currentStep',
                    'currentStep.requiredRoles'
                ]
            });
            if (!instance) {
                throw new BadRequestException('Workflow instance not found.');
            }
            if ([WORKFLOW_STATUS.COMPLETED, WORKFLOW_STATUS.CANCELLED, WORKFLOW_STATUS.REJECTED].includes(instance.status)) {
                throw new BadRequestException(`Workflow instance cannot be cancelled in its current status: ${instance.status}`);
            }
            const currentStepDef = instance.workflowDefinition.steps.find(s => s.id === instance.currentStepId);
            if (!currentStepDef || !instance.currentStep) {
                throw new BadRequestException('Workflow instance does not have a current step.');
            }
            // Authorization: same roles can cancel
            const hasRoleCancel = currentStepDef.requiredRoles.some(r => r.id === user.role!.id);
            if (!hasRoleCancel) {
                throw new ForbiddenException('User does not have the required role to cancel this workflow instance.');
            }
            const taskEntity = entityManager.create(WorkflowTask, {
                workflowInstanceId: instance.id,
                workflowStepDefinitionId: instance.currentStepId,
                actedByUserId: this.userContext.userId,
                actedByRoleId: user.role.id,
                status: WORKFLOW_TASK.CANCEL,
                comments: message || 'Cancelled'
            });
            await entityManager.save(WorkflowTask, taskEntity);
            instance.status = WORKFLOW_STATUS.CANCELLED;
            instance.completionDate = new Date();
            await entityManager.save(WorkflowInstance, instance);
            return instance;
        });
    }

    async needsForReviewWorkflowInstance(instanceId: string, message?: string): Promise<WorkflowInstance> {
        const tenantId = this.tenantContext.tenantId;
        if (!isUUID(tenantId)) {
            throw new ForbiddenException('Tenant ID is missing from context.');
        }
        return await this.workflowInstanceRepository.manager.transaction(async (entityManager) => {
            const user = await entityManager.findOne(User, { where: { id: this.userContext.userId, tenantId }, relations: ['role'] });
            if (!user) {
                throw new ForbiddenException('User not found or does not have permission to mark this workflow instance for review.');
            }
            if (!user.role) {
                throw new ForbiddenException('User does not have a role assigned and cannot mark this workflow instance for review.');
            }
            const instance = await entityManager.findOne(WorkflowInstance, {
                where: { id: instanceId, tenantId },
                relations: [
                    'workflowDefinition',
                    'workflowDefinition.steps',
                    'workflowDefinition.steps.requiredRoles',
                    'currentStep',
                    'currentStep.requiredRoles'
                ]
            });
            if (!instance) {
                throw new BadRequestException('Workflow instance not found.');
            }
            if ([WORKFLOW_STATUS.COMPLETED, WORKFLOW_STATUS.CANCELLED, WORKFLOW_STATUS.REJECTED].includes(instance.status)) {
                throw new BadRequestException(`Workflow instance cannot be marked for review in its current status: ${instance.status}`);
            }
            const currentStepDef = instance.workflowDefinition.steps.find(s => s.id === instance.currentStepId);
            if (!currentStepDef || !instance.currentStep) {
                throw new BadRequestException('Workflow instance does not have a current step.');
            }
            if (!currentStepDef.requiredRoles?.length) {
                throw new BadRequestException('Current step does not have any required roles defined.');
            }
            const hasRoleReview = currentStepDef.requiredRoles.some(r => r.id === user.role!.id);
            if (!hasRoleReview) {
                throw new ForbiddenException('User does not have the required role to mark this workflow instance for review.');
            }
            const taskEntity = entityManager.create(WorkflowTask, {
                workflowInstanceId: instance.id,
                workflowStepDefinitionId: instance.currentStepId,
                actedByUserId: this.userContext.userId,
                actedByRoleId: user.role.id,
                status: WORKFLOW_TASK.NEEDS_REVISION,
                comments: message || 'Needs revision'
            });
            await entityManager.save(WorkflowTask, taskEntity);
            instance.status = WORKFLOW_STATUS.NEEDS_REVISION;
            await entityManager.save(WorkflowInstance, instance);
            return instance;
        });
    }
}