import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsEmail, IsOptional, IsString, IsUUID, MaxLength, MinLength } from 'class-validator';

export class CreateUserDto {
    @ApiProperty({
        description: "The user's first name. Must be at least 1-100 characters.",
        example: 'John',
        minLength: 1,
        maxLength: 100,
        required: true,
        type: String,
    })
    @IsString()
    @MinLength(3)
    @MaxLength(100)
    fName: string;

    @ApiProperty({
        description: "The user's last name. Must be at least 1-100 characters.",
        example: 'Doe',
        minLength: 1,
        maxLength: 100,
        required: true,
        type: String,
    })
    @IsString()
    @MinLength(3)
    @MaxLength(100)
    lName: string;

    @ApiProperty({
        description: "The user's username. Must be 4-30 characters.",
        example: 'johndoe',
        minLength: 4,
        maxLength: 30,
        required: true,
        type: String,
    })
    @IsString()
    @MinLength(4)
    @MaxLength(30)
    username: string;

    @ApiProperty({
        description: "The user's password. Must be at least 6 characters.",
        example: 'P@ssw0rd',
        minLength: 6,
        required: true,
        type: String,
    })
    @IsString()
    @MinLength(6)
    password: string;

    @ApiProperty({
        description: "The user's email address.",
        example: 'john.doe@example.com',
        required: true,
        type: String,
    })
    @IsEmail()
    email: string;

    @IsOptional()
    @IsBoolean()
    isActive?: boolean;

    @ApiProperty({
        description: "The user's role ID (UUID). Optional.",
        example: '550e8400-e29b-41d4-a716-446655440000',
        required: false,
        type: String,
        format: 'uuid',
    })
    @IsUUID()
    @IsOptional()
    roleId?: string;

    @ApiProperty({
        description: "The user's organization ID (UUID). Optional.",
        example: '550e8400-e29b-41d4-a716-446655440001',
        required: false,
        type: String,
        format: 'uuid',
    })
    @IsUUID()
    @IsOptional()
    organizationalUnitId: string;
}
