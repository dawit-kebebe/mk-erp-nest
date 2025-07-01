import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsBoolean, IsEmail, IsOptional, IsString, IsUUID, MaxLength, MinLength } from 'class-validator';

export class RespondUserDto {
    @Expose()
    @ApiProperty({
        description: "The unique identifier (UUID) of the user.",
        example: "550e8400-e29b-41d4-a716-446655440010",
        required: true,
        type: String,
        format: "uuid",
    })
    @IsUUID()
    id: string;
    
    @Expose()
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

    @Expose()
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

    @Expose()
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

    @Expose()
    @ApiProperty({
        description: "The user's email address.",
        example: 'john.doe@example.com',
        required: true,
        type: String,
    })
    @IsEmail()
    email: string;

    @Expose()
    @IsOptional()
    @IsBoolean()
    isActive?: boolean;

    @Expose()
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

    @Expose()
    @ApiProperty({
        description: "The user's organization ID (UUID). Optional.",
        example: '550e8400-e29b-41d4-a716-446655440001',
        required: false,
        type: String,
        format: 'uuid',
    })
    @IsUUID()
    @IsOptional()
    organizationalUnitId?: string;
}