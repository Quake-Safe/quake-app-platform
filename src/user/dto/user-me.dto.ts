import { ApiProperty } from '@nestjs/swagger';
import { $Enums, UserProfile } from '@prisma/client';

export class UserMeDto implements UserProfile {
  @ApiProperty({
    description: 'The role of the user.',
    enum: $Enums.UserProfileRole,
  })
  role: $Enums.UserProfileRole;

  @ApiProperty({
    description: 'The short name of a government agency.',
  })
  shortName: string | null;
  @ApiProperty({
    description: 'The full name of a government agency.',
  })
  fullName: string | null;

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
    userMeDto.fullName = userProfile.fullName;
    userMeDto.shortName = userProfile.shortName;
    userMeDto.role = userProfile.role;

    return userMeDto;
  }
}
