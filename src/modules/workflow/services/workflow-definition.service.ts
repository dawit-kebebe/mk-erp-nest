import { TenantContext } from '@mk/common/contexts/tenant.context';
import { TEntityCrudService } from '@mk/common/utils/shared-crud.service';
import { OrganizationalUnit } from '@mk/database/entities/organizational-unit.entity';
import { WorkflowDefinition } from '@mk/database/entities/workflow-definition.entity';
import { WorkflowStepDefinition } from '@mk/database/entities/workflow-step-definition.entity';
import { BadRequestException, ForbiddenException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { isUUID } from 'class-validator';
import { Repository } from 'typeorm';
import { CreateWorkflowDefinitionDto } from '../dto/create-workflow-definition.dto';
import { UpdateWorkflowDefinitionDto } from '../dto/update-workflow-definition.dto';

@Injectable()
export class WorkflowDefinitionService extends TEntityCrudService<WorkflowDefinition> {
    private readonly superTenantId: string;

    constructor(
        @InjectRepository(WorkflowDefinition) private readonly workflowRepository: Repository<WorkflowDefinition>,
        @Inject() private readonly config: ConfigService,
        @Inject() readonly tenantContext: TenantContext
    ) {
        super(workflowRepository, tenantContext);
        this.superTenantId = this.config.get<string>('GLOBAL_TENANT')!;
    }

    async findStepByOrderAndWorkflowDefinitionId(
        stepOrder: number,
        workflowDefinitionId: string
    ): Promise<WorkflowStepDefinition> {
        const tenantId = this.tenantContext.tenantId;
        if (!isUUID(tenantId)) {
            throw new ForbiddenException('Tenant ID is missing from context.');
        }

        const steps = await this.findStepsByWorkflowDefinitionId(workflowDefinitionId)

        if (!steps || steps.length === 0) {
            throw new NotFoundException('No steps found for this workflow definition.');
        }

        const step = steps.find((s) => s.stepOrder === stepOrder);
        if (!step) {
            throw new NotFoundException(`Step with order ${stepOrder} not found in the workflow definition.`);
        }

        return step;
    }

    async findStepsByWorkflowDefinitionId(id: string): Promise<WorkflowStepDefinition[]> {
        const tenantId = this.tenantContext.tenantId;
        if (!isUUID(tenantId)) {
            throw new ForbiddenException('Tenant ID is missing from context.');
        }

        let workflowDefinition;

        if (this.superTenantId === tenantId) {
            workflowDefinition = await this.workflowRepository.findOne({
                where: { id }
            });
        } else {
            workflowDefinition = await this.workflowRepository.findOne({
                where: [
                    { id, tenantId: tenantId },
                    { id, organizationalUnitId: tenantId }
                ]
            });
        }

        if (!workflowDefinition) {
            throw new NotFoundException('Workflow definition not found.');
        }

        if (!workflowDefinition.steps || workflowDefinition.steps.length === 0) {
            throw new NotFoundException('No steps found for this workflow definition.');
        }

        return workflowDefinition.steps.sort((a: WorkflowStepDefinition, b: WorkflowStepDefinition) => a.stepOrder - b.stepOrder);
    }

    async create(itemData: CreateWorkflowDefinitionDto): Promise<WorkflowDefinition | WorkflowDefinition[]> {
        const tenantId = this.tenantContext.tenantId;
        if (!isUUID(tenantId)) {
            throw new ForbiddenException('Tenant ID is missing from context.');
        }

        return await this.workflowRepository.manager.transaction(async (entityManager) => {
            const entity = this.workflowRepository.create({ ...itemData });

            if (entity.organizationalUnitId !== tenantId) {
                if (this.superTenantId !== tenantId) {
                    throw new ForbiddenException('You can only create workflows for your own root organizational unit.');
                } else {
                    const newEntity = await entityManager.save(WorkflowDefinition, entity);
                    entity.organizationalUnitId = newEntity.organizationalUnit.tenantId;
                    entity.tenantId = newEntity.organizationalUnit.tenantId;
                }
            } else {
                entity.tenantId = tenantId;
            }

            return await entityManager.save(WorkflowDefinition, entity);
        });
    }

    async update(id: string, itemData: UpdateWorkflowDefinitionDto): Promise<WorkflowDefinition> {
        const tenantId = this.tenantContext.tenantId;
        if (!isUUID(tenantId)) {
            throw new ForbiddenException('Tenant ID is missing from context.');
        }

        return await this.workflowRepository.manager.transaction(async (entityManager) => {
            const existing = await entityManager.findOne(WorkflowDefinition, { where: { id } });
            if (!existing) {
                throw new BadRequestException('Workflow definition not found.');
            }

            const isSuperTenant = this.superTenantId === tenantId;
            const isOwnOrgUnit = existing.organizationalUnitId === tenantId;

            if (!isOwnOrgUnit && !isSuperTenant) {
                throw new ForbiddenException('You can only update workflows for your own root organizational unit.');
            }

            let updated = entityManager.merge(WorkflowDefinition, existing, itemData);

            if (
                itemData.organizationalUnitId &&
                itemData.organizationalUnitId !== existing.organizationalUnitId
            ) {
                if (!isSuperTenant) {
                    throw new ForbiddenException('You can only update workflows for your own root organizational unit.');
                }
                const newOrgUnit = await entityManager.findOne(OrganizationalUnit, {
                    where: { id: itemData.organizationalUnitId },
                });
                if (!newOrgUnit) {
                    throw new BadRequestException('Organizational unit not found for the provided ID.');
                }
                updated.organizationalUnitId = newOrgUnit.tenantId;
                updated.tenantId = newOrgUnit.tenantId;
            } else {
                updated.tenantId = isSuperTenant && updated.organizationalUnitId !== tenantId
                    ? updated.organizationalUnitId
                    : tenantId;
            }

            return await entityManager.save(WorkflowDefinition, updated);
        });
    }
}
