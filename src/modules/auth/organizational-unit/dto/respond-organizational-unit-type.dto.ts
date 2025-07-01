import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsOptional, IsString, MaxLength, IsNotEmpty, IsUUID } from "class-validator";
import { Expose } from "class-transformer";

export class RespondOrganizationalUnitTypeDto {
    @ApiProperty({
        description: "The unique identifier (UUID) of the organizational unit type.",
        example: "550e8400-e29b-41d4-a716-446655440010",
        required: true,
        type: String,
        format: "uuid",
    })
    @IsUUID()
    @Expose()
    id: string;

    @ApiProperty({
        description: "The tag (name) of the organizational unit type. Must be unique and 1-100 characters.",
        example: "department",
        minLength: 1,
        maxLength: 100,
        required: true,
        type: String,
    })
    @IsString()
    @IsNotEmpty()
    @MaxLength(100)
    @Expose()
    tag: string;

    @ApiPropertyOptional({
        description: "A description for the organizational unit type.",
        example: "Represents a department within the organization.",
        type: String,
    })
    @IsOptional()
    @IsString()
    @Expose()
    description?: string;
}