import { ApiProperty } from '@nestjs/swagger';

export class UserMeDto {
  @ApiProperty()
  id: string;
  @ApiProperty()
  email: string;
  @ApiProperty()
  username: string;
}
