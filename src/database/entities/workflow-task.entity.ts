import { Tenant } from '@mk/common/entities/tenant.entity';
import { WORKFLOW_TASK } from '@mk/common/enum/workflow-task.enum';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Role } from './role.entity';
import { User } from './user.entity';
import { WorkflowInstance } from './workflow-instance.entity';
import { WorkflowStepDefinition } from './workflow-step-definition.entity';

@Entity('workflow_tasks')
export class WorkflowTask extends Tenant {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  workflowStepDefinitionId: string;

  @ManyToOne(
    () => WorkflowStepDefinition,
    (step) => step.tasks,
  )
  @JoinColumn({ name: 'workflowStepDefinitionId' })
  workflowStepDefinition: WorkflowStepDefinition;

  @Column('uuid')
  workflowInstanceId: string;

  @ManyToOne(
    () => WorkflowInstance,
    (instance) => instance.tasks,
    { onDelete: 'CASCADE' }
  )
  @JoinColumn({ name: 'workflowInstanceId' })
  workflowInstance: WorkflowInstance;

  @Column({ type: 'enum', enum: WORKFLOW_TASK, nullable: false })
  status: WORKFLOW_TASK;

  @Column('uuid', { nullable: true })
  actedByUserId?: string;

  @ManyToOne(
    () => User,
    { nullable: true }
  )
  @JoinColumn({ name: 'actedByUserId' })
  actedByUser?: User;

  @Column('uuid', { nullable: true })
  actedByRoleId?: string;

  @ManyToOne(
    () => Role,
    { nullable: true }
  )
  @JoinColumn({ name: 'actedByRoleId' })
  actedByRole?: Role;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  actionDate?: Date;

  @Column({ type: 'text', nullable: true })
  comments?: string;
}