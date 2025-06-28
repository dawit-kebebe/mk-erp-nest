import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, MaxLength, IsUUID, IsNotEmpty } from 'class-validator';

export class CreateOrganizationalUnitDto {
    @ApiProperty({
        description: "The name of the organizational unit. Must be unique and 1-100 characters.",
        example: "Finance Department",
        minLength: 1,
        maxLength: 100,
        required: true,
        type: String,
    })
    @IsString()
    @IsNotEmpty()
    @MaxLength(100)
    name: string;

    @ApiPropertyOptional({
        description: "A description for the organizational unit.",
        example: "Handles all financial operations.",
        type: String,
    })
    @IsOptional()
    @IsString()
    description?: string;

    @ApiPropertyOptional({
        description: "The UUID of the parent organizational unit, if any.",
        example: "550e8400-e29b-41d4-a716-446655440000",
        type: String,
        format: "uuid",
        required: false,
    })
    @IsOptional()
    @IsUUID()
    parentOrgId?: string;

    @ApiProperty({
        description: "The UUID of the organizational unit type.",
        example: "550e8400-e29b-41d4-a716-446655440001",
        type: String,
        format: "uuid",
        required: true,
    })
    @IsUUID()
    organizationalUnitTypeId: string;
}