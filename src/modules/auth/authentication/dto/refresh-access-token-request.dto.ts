import { ApiProperty } from '@nestjs/swagger';

export class RefreshAccessTokenRequestDto {
  @ApiProperty({
    description: 'The refresh token used to obtain a new access token',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  refresh_token: string;
}
