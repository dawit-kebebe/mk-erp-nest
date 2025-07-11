import { WORKFLOW_STATUS } from "@mk/common/enum/workflow-status.enum"
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsUUID, IsEnum, IsOptional, IsString } from 'class-validator';

export class CreateWorkflowTaskDto {
    @ApiProperty({
        description: 'The specific step definition this task is derived from.',
        example: 'd290f1ee-6c54-4b01-90e6-d701748f0851',
    })
    @IsUUID()
    workflowStepDefinitionId: string;

    @ApiProperty({
        description: 'The specific instance of workflow item on which the current task was performed on.',
        example: 'a1b2c3d4-5678-90ab-cdef-1234567890ab',
    })
    @IsUUID()
    workflowInstanceId: string;

    @ApiProperty({
        description: 'The current status of this individual task.',
        enum: WORKFLOW_STATUS,
        example: WORKFLOW_STATUS.COMPLETED,
    })
    @IsEnum(WORKFLOW_STATUS)
    status: WORKFLOW_STATUS;

    @ApiPropertyOptional({
        description: 'The user who actually took action on this task.',
        example: 'e7b8c9d0-1234-5678-9abc-def012345678',
        nullable: true,
    })
    @IsOptional()
    @IsUUID()
    actedByUserId?: string;

    @ApiPropertyOptional({
        description: 'The date and time when the action was taken.',
        example: '2024-06-01T12:34:56.789Z',
        type: String,
        format: 'date-time',
        nullable: true,
    })
    @IsOptional()
    actionDate?: Date;

    @ApiPropertyOptional({
        description: 'Any notes or reasons provided by the actor.',
        example: 'Approved due to sufficient documentation.',
    })
    @IsOptional()
    @IsString()
    comments?: string;
}