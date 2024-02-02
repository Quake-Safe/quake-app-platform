import { ApiProperty } from '@nestjs/swagger';
import { UserProfile } from '@prisma/client';

export class PostAuthorDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  username: string;

  @ApiProperty()
  fullName: string;

  @ApiProperty()
  shortName: string;

  @ApiProperty()
  avatarUrl: string;

  public static fromUser(user: UserProfile) {
    const dto = new PostAuthorDto();
    dto.id = user.id;
    dto.username = user.username;
    dto.avatarUrl = user.avatarUrl ?? '';
    dto.fullName = user.fullName ?? '';
    dto.shortName = user.shortName ?? '';

    return dto;
  }
}
