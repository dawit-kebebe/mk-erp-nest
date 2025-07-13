import { Tenant } from '@mk/common/entities/tenant.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { WorkflowStepDefinition } from './workflow-step-definition.entity';
import { WorkflowInstance } from './workflow-instance.entity';
import { User } from './user.entity';
import { WORKFLOW_STATUS } from '@mk/common/enum/workflow-status.enum';

@Entity('workflow_tasks')
export class WorkflowTask extends Tenant {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  workflowStepDefinitionId: string;

  @ManyToOne(
    () => WorkflowStepDefinition,
    (step) => step.tasks,
    { onDelete: 'CASCADE' }
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

  @Column({ type: 'enum', enum: WORKFLOW_STATUS, default: WORKFLOW_STATUS.IN_PROGRESS })
  status: WORKFLOW_STATUS;

  @Column('uuid', { nullable: true })
  actedByUserId?: string;

  @ManyToOne(
    () => User,
    { nullable: true }
  )
  @JoinColumn({ name: 'actedByUserId' })
  actedByUser?: User;

  @Column({ type: 'timestamp', nullable: true })
  actionDate?: Date;

  @Column({ type: 'text', nullable: true })
  comments?: string;
}