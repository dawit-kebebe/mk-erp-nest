import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class RefreshAccessTokenResponseDto {
  @ApiProperty({
    description: 'The refreshed access token to be refreshed',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  @Expose()
  access_token: string;
}
