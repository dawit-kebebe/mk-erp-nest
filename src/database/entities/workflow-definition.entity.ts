import { Tenant } from '@mk/common/entities/tenant.entity';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';

import { FEATURES } from '@mk/common/enum/feature.enum';
import { WorkflowStepDefinition } from './workflow-step-definition.entity';
import { WorkflowInstance } from './workflow-instance.entity';

@Entity('workflow_definitions')
export class WorkflowDefinition extends Tenant {
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