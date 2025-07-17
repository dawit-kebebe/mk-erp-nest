import { Tenant } from '@mk/common/entities/tenant.entity';
import { FEATURES } from '@mk/common/enum/feature.enum';
import { WORKFLOW_STATUS } from '@mk/common/enum/workflow-status.enum';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { User } from './user.entity';
import { WorkflowDefinition } from './workflow-definition.entity';
import { WorkflowStepDefinition } from './workflow-step-definition.entity';
import { WorkflowTask } from './workflow-task.entity';

@Entity('workflow_instances')
@Unique(['entityId', 'entityType', 'tenantId'])
export class WorkflowInstance extends Tenant {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  workflowDefinitionId: string;

  @ManyToOne(
    () => WorkflowDefinition,
    (definition) => definition.instances,
    { onDelete: 'CASCADE', eager: true },
  )
  @JoinColumn({ name: 'workflowDefinitionId' })
  workflowDefinition: WorkflowDefinition;

  @Column('uuid')
  entityId: string;

  @Column({ type: 'varchar', length: 100 })
  entityType: FEATURES;

  @Column({ type: 'enum', enum: WORKFLOW_STATUS, default: WORKFLOW_STATUS.IN_PROGRESS })
  status: WORKFLOW_STATUS;

  @Column('uuid', { nullable: true })
  currentStepId?: string;

  @ManyToOne(
    () => WorkflowStepDefinition,
    { nullable: true }
  )
  @JoinColumn({ name: 'currentStepId' })
  currentStep?: WorkflowStepDefinition;

  @Column('uuid')
  submittedByUserId: string;

  @ManyToOne(
    () => User,
    { nullable: false }
  )
  @JoinColumn({ name: 'submittedByUserId' })
  submittedByUser: User;

  @Column({ type: 'timestamp', default: () => "CURRENT_TIMESTAMP"  })
  submissionDate: Date;

  @Column({ type: 'timestamp', nullable: true })
  completionDate?: Date;

  @OneToMany(
    () => WorkflowTask,
    (task: WorkflowTask) => task.workflowInstance,
  )
  tasks?: WorkflowTask[];
}