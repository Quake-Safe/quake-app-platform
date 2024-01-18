import { ApiProperty } from '@nestjs/swagger';

export class UserDto {
  @ApiProperty()
  name: string | null;

  @ApiProperty()
  email: string;
}
