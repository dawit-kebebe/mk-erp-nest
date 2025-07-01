import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class LoginResponseDto {
  @ApiProperty({ description: 'Access token', example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9' })
  @Expose()
  access_token: string;

  @ApiProperty({ description: 'Refresh token', example: 'dGhpcyBpcyBhIHNyZWZyZXNoIHRva2tlbg==' })
  @Expose()
  refresh_token: string;
}
