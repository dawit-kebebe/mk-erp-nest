import { WORKFLOW_STATUS } from "@mk/common/enum/workflow-status.enum"
import { ApiProperty } from '@nestjs/swagger';
import { IsUUID, IsString, IsEnum, IsOptional, IsDate } from 'class-validator';

export class CreateWorkflowInstanceDto {
    @ApiProperty({
        example: 'a3f1c2d4-5678-4e9b-8c2a-123456789abc',
        description: 'Links this instance to its workflow definition blueprint (UUID of WorkflowDefinition).',
    })
    @IsUUID()
    workflowDefinitionId: string;

    @ApiProperty({
        example: 'b2e4d5f6-7890-4c1d-9e3b-987654321def',
        description: 'The ID of the specific business entity being managed (UUID, polymorphic association).',
    })
    @IsUUID()
    entityId: string;

    @ApiProperty({
        example: 'BudgetPlan',
        description: 'The type of the business entity (e.g., "BudgetPlan", "ExpenseRequest").',
    })
    @IsString()
    entityType: string;

    @ApiProperty({
        example: WORKFLOW_STATUS.IN_PROGRESS,
        enum: WORKFLOW_STATUS,
        description: 'The current overall status of this workflow instance.',
    })
    @IsEnum(WORKFLOW_STATUS)
    status: WORKFLOW_STATUS;

    @ApiProperty({
        example: 'c4d6e7f8-9012-4b3c-8d4e-abcdef123456',
        description: 'The ID of the step(s) currently awaiting action (UUID of WorkflowStepDefinition, nullable if completed/rejected).',
        nullable: true,
        required: false,
    })
    @IsOptional()
    @IsUUID()
    currentStepId?: string;

    @ApiProperty({
        example: 'd5e6f7a8-1234-4c5d-9e6f-654321fedcba',
        description: 'The user who initiated this workflow instance (UUID of User).',
    })
    @IsUUID()
    submittedByUserId: string;

    @ApiProperty({
        example: '2024-06-01T12:34:56.789Z',
        description: 'The date and time when the workflow was initiated.',
        type: String,
        format: 'date-time',
    })
    @IsDate()
    submissionDate: Date;

    @ApiProperty({
        example: '2024-06-02T15:00:00.000Z',
        description: 'The date and time when the workflow was completed (either approved or rejected). Nullable.',
        type: String,
        format: 'date-time',
        nullable: true,
        required: false,
    })
    @IsOptional()
    @IsDate()
    completionDate?: Date;
}
