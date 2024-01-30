import { ApiProperty } from '@nestjs/swagger';
import { UserProfile } from '@prisma/client';

export class PostAuthorDto {
  @ApiProperty()
  id: string;
  @ApiProperty()
  name: string;

  public static fromUser(user: UserProfile) {
    const dto = new PostAuthorDto();
    dto.id = user.id;
    dto.name = user.fullName ?? 'Unknown Author';

    return dto;
  }
}
