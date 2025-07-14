import { IsSequential } from "@mk/common/decorators/validate-sequencial-workflow-step";
import { APPROVAL_STRATEGY } from "@mk/common/enum/approval-strategy.enum";
import { FEATURES } from "@mk/common/enum/feature.enum";
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from "class-transformer";
import { ArrayNotEmpty, IsArray, IsBoolean, IsEnum, IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateWorkflowStepDefinitionDto {

    @ApiProperty({
        example: 1,
        description: "Defines the sequential order of this step within its workflow (e.g., 1, 2, 3...). Used for flow control.",
    })
    @IsNotEmpty()
    stepOrder: number;

    @ApiProperty({
        example: "Department Head Approval",
        description: "Human-readable name for this specific step (e.g., 'Department Head Approval', 'Finance Review').",
    })
    @IsString()
    @IsNotEmpty()
    stepName: string;

    @ApiPropertyOptional({
        example: "Department head reviews and approves the budget plan.",
        description: "Explains the purpose or actions for this step.",
    })
    @IsOptional()
    @IsString()
    description?: string;

    
    @ApiProperty({
        example: APPROVAL_STRATEGY.ALL_MUST_APPROVE,
        enum: APPROVAL_STRATEGY,
        description: "Defines how multiple approvers at this step are handled.",
    })
    @IsEnum(APPROVAL_STRATEGY)
    approvalStrategy: APPROVAL_STRATEGY;

    @ApiProperty({
        example: true,
        description: "If true, all tasks for this step can be processed concurrently. Automatically set based on approvalStrategy: true for ALL_MUST_APPROVE or MAJORITY, false for ONE_OF_MANY.",
        default: false,
    })
    get isParallel(): boolean {
        return (
            this.approvalStrategy === APPROVAL_STRATEGY.ALL_MUST_APPROVE ||
            this.approvalStrategy === APPROVAL_STRATEGY.MAJORITY
        );
    }

    @ApiProperty({
        example: ["a1b2c3d4-e5f6-7890-abcd-ef1234567890"],
        description: "Specifies which roles are eligible to perform this step. A user needs at least one of these roles.",
        type: [String],
    })
    @IsArray()
    @ArrayNotEmpty()
    @IsString({ each: true })
    requiredRoleIds: string[];

}

export class CreateWorkflowDefinitionDto {
    @ApiProperty({
        example: "Budget Plan Approval Workflow",
        description: "A human-readable name for the workflow.",
    })
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiPropertyOptional({
        example: "This workflow handles the approval process for budget plans.",
        description: "Detailed explanation of the workflow's purpose.",
    })
    @IsOptional()
    @IsString()
    description?: string;

    @ApiProperty({
        example: FEATURES.BUDGET_PLAN,
        enum: FEATURES,
        description: "The business entity type this workflow governs.",
    })
    @IsEnum(FEATURES)
    appliesToFeature: FEATURES;

    @ApiProperty({
        example: "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
        description: "The ID of the root organizational unit this workflow belongs to.",
    })
    @IsUUID()
    @IsNotEmpty()
    organizationalUnitId: string;

    @ApiProperty({
        example: true,
        description: "A flag to enable or disable the workflow definition.",
    })
    @IsBoolean()
    isActive: boolean;

    @ApiProperty({
        type: [CreateWorkflowStepDefinitionDto],
        description: "The ordered steps that make up this workflow definition.",
    })
    @ArrayNotEmpty()
    @IsArray()
    @IsSequential({ message: 'Steps must have sequential stepOrder starting from 1' })
    @Type(() => CreateWorkflowStepDefinitionDto)
    steps: CreateWorkflowStepDefinitionDto[];
}