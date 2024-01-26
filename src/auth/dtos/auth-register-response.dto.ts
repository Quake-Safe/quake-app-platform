import { ApiProperty } from '@nestjs/swagger';

export class AuthRegisterResponseDto {
  @ApiProperty({
    description: 'Access token',
  })
  accessToken: string;
}
