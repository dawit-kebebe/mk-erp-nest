import { APPROVAL_STRATEGY } from "@mk/common/enum/approval-strategy.enum";
import { FEATURES } from "@mk/common/enum/feature.enum"
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from "class-transformer";
import { IsString, IsNotEmpty, IsOptional, IsEnum, IsBoolean, IsArray, ArrayNotEmpty, IsUUID } from 'class-validator';
import { Expose } from "class-transformer";

export class RespondWorkflowStepDefinitionDto {
    @ApiProperty({
        example: 1,
        description: "Defines the sequential order of this step within its workflow (e.g., 1, 2, 3...). Used for flow control.",
    })
    @IsNotEmpty()
    @Expose()
    stepOrder: number;

    @ApiProperty({
        example: "Department Head Approval",
        description: "Human-readable name for this specific step (e.g., 'Department Head Approval', 'Finance Review').",
    })
    @IsString()
    @IsNotEmpty()
    @Expose()
    stepName: string;

    @ApiPropertyOptional({
        example: "Department head reviews and approves the budget plan.",
        description: "Explains the purpose or actions for this step.",
    })
    @IsOptional()
    @IsString()
    @Expose()
    description?: string;

    @ApiProperty({
        example: APPROVAL_STRATEGY.ALL_MUST_APPROVE,
        enum: APPROVAL_STRATEGY,
        description: "Defines how multiple approvers at this step are handled.",
    })
    @IsEnum(APPROVAL_STRATEGY)
    @Expose()
    approvalStrategy: APPROVAL_STRATEGY;

    @ApiProperty({
        example: true,
        description: "If true, all tasks for this step can be processed concurrently. Automatically set based on approvalStrategy: true for ALL_MUST_APPROVE or MAJORITY, false for ONE_OF_MANY.",
        default: false,
    })
    @Expose()
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
    @Expose()
    requiredRoleIds: string[];

}

export class RespondWorkflowDefinitionDto {

    @ApiProperty({
        example: "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
        description: "Unique identifier for the workflow definition.",
    })
    @IsUUID()
    @Expose()
    id: string;
    
    @ApiProperty({
        example: "Budget Plan Approval Workflow",
        description: "A human-readable name for the workflow.",
    })
    @IsString()
    @IsNotEmpty()
    @Expose()
    name: string;

    @ApiPropertyOptional({
        example: "This workflow handles the approval process for budget plans.",
        description: "Detailed explanation of the workflow's purpose.",
    })
    @IsOptional()
    @IsString()
    @Expose()
    description?: string;

    @ApiProperty({
        example: FEATURES.BUDGET_PLAN,
        enum: FEATURES,
        description: "The business entity type this workflow governs.",
    })
    @IsEnum(FEATURES)
    @Expose()
    appliesToFeature: FEATURES;

    @ApiProperty({
        example: "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
        description: "The ID of the root organizational unit this workflow belongs to.",
    })
    @IsUUID()
    @IsNotEmpty()
    @Expose()
    organizationalUnitId: string;

    @ApiProperty({
        example: true,
        description: "A flag to enable or disable the workflow definition.",
    })
    @IsBoolean()
    @Expose()
    isActive: boolean;

    @ApiProperty({
        type: [RespondWorkflowStepDefinitionDto],
        description: "The ordered steps that make up this workflow definition.",
    })
    @ArrayNotEmpty()
    @IsArray()
    @Type(() => RespondWorkflowStepDefinitionDto)
    @Expose()
    steps: RespondWorkflowStepDefinitionDto[];
}