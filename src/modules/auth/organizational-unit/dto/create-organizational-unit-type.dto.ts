import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, MaxLength, IsNotEmpty } from 'class-validator';

export class CreateOrganizationalUnitTypeDto {
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
    tag: string;

    @ApiPropertyOptional({
        description: "A description for the organizational unit type.",
        example: "Represents a department within the organization.",
        type: String,
    })
    @IsOptional()
    @IsString()
    description?: string;
}