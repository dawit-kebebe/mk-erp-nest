import { Tenant } from '@mk/common/entities/tenant.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { WorkflowDefinition } from './workflow-definition.entity';
import { WorkflowTask } from './workflow-task.entity';
import { APPROVAL_STRATEGY } from '@mk/common/enum/approval-strategy.enum';
import { Role } from './role.entity';

@Entity('workflow_step_definitions')
export class WorkflowStepDefinition extends Tenant {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  stepOrder: number;

  @Column({ type: 'varchar', length: 200 })
  stepName: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ type: 'enum', enum: APPROVAL_STRATEGY })
  approvalStrategy: APPROVAL_STRATEGY;

  @ManyToOne(
    () => WorkflowDefinition,
    (workflow) => workflow.steps,
    { onDelete: 'CASCADE' },
  )
  workflowDefinition: WorkflowDefinition;

  @ManyToMany(() => Role, { eager: true })
  @JoinTable({
    name: 'workflow_step_required_roles',
    joinColumn: { name: 'workflowStepDefinitionId', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'roleId', referencedColumnName: 'id' },
  })
  requiredRoles: Role[];

  @OneToMany(
    () => WorkflowTask,
    (task) => task.workflowStepDefinition,
  )
  tasks: WorkflowTask[];
}