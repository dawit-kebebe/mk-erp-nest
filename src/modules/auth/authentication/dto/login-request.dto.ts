import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginRequestDto {
  @ApiProperty({
    description: "The user's email address.",
    example: 'john.doe@example.com',
  })
  @IsEmail()
  @IsNotEmpty()
  @IsString()
  email: string;

  @ApiProperty({
    description: "The user's password. Must be at least 6 characters.",
    example: 'securePassword123',
    minLength: 6,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password: string;
}
