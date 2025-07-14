import { Column, Entity, OneToMany, PrimaryGeneratedColumn, Unique } from 'typeorm';
import { TenantOrganizationalUnitAware } from '@mk/common/entities/tenant-org-unit.entity';
import { FEATURES } from '@mk/common/enum/feature.enum';
import { WorkflowInstance } from './workflow-instance.entity';
import { WorkflowStepDefinition } from './workflow-step-definition.entity';

@Entity('workflow_definitions')
@Unique(['appliesToFeature', 'tenantId'])
export class WorkflowDefinition extends TenantOrganizationalUnitAware {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 200 })
  name: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ type: 'enum', enum: FEATURES })
  appliesToFeature: FEATURES;

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @OneToMany(
    () => WorkflowStepDefinition,
    (step: WorkflowStepDefinition) => step.workflowDefinition,
    { cascade: true, eager: true },
  )
  steps: WorkflowStepDefinition[];

  @OneToMany(
    () => WorkflowInstance,
    (instance: WorkflowInstance) => instance.workflowDefinition,
  )
  instances: WorkflowInstance[];
}