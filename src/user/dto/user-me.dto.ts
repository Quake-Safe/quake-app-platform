import { ApiProperty } from '@nestjs/swagger';
import { UserProfile } from '@prisma/client';

export class UserMeDto implements UserProfile {
  @ApiProperty({
    description: 'The supabase id of the user.',
  })
  supabaseId: string;
  @ApiProperty({
    description: 'The id of the user.',
  })
  id: string;
  @ApiProperty()
  email: string;
  @ApiProperty()
  username: string;

  @ApiProperty()
  avatarUrl: string | null;
  @ApiProperty()
  firstName: string;
  @ApiProperty()
  lastName: string;
  @ApiProperty()
  middleName: string;

  @ApiProperty()
  createdAt: Date;
  @ApiProperty()
  updatedAt: Date;

  public static fromUserProfile(userProfile: UserProfile): UserMeDto {
    const userMeDto = new UserMeDto();
    userMeDto.supabaseId = userProfile.supabaseId;
    userMeDto.createdAt = userProfile.createdAt;
    userMeDto.updatedAt = userProfile.updatedAt;
    userMeDto.avatarUrl = userProfile.avatarUrl;
    userMeDto.firstName = userProfile.firstName;
    userMeDto.lastName = userProfile.lastName;
    userMeDto.middleName = userProfile.middleName;
    userMeDto.id = userProfile.id;
    userMeDto.email = userProfile.email;
    userMeDto.username = userProfile.username;
    return userMeDto;
  }
}
