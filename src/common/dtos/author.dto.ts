import { ApiProperty } from '@nestjs/swagger';
import { UserProfile } from '@prisma/client';

export class AuthorDto {
  @ApiProperty({
    type: 'string',
    description: 'The id of the user.',
  })
  id: string;

  @ApiProperty({
    type: 'string',
    description: 'The username of the user.',
  })
  username: string;
  @ApiProperty({
    type: 'string',
    description: 'The email of the user.',
  })
  email: string;

  @ApiProperty({
    type: 'string',
    description: 'The first name of the user.',
    required: false,
    nullable: true,
  })
  firstName?: string;
  @ApiProperty({
    type: 'string',
    description: 'The last name of the user.',
    required: false,
    nullable: true,
  })
  lastName?: string;
  @ApiProperty({
    type: 'string',
    description: 'The middle name of the user.',
    required: false,
    nullable: true,
  })
  middleName?: string;

  @ApiProperty({
    type: 'string',
    description:
      'The short name of the user. Normally this is populated for government agencies.',
    required: false,
    nullable: true,
  })
  shortName?: string | null;

  @ApiProperty({
    type: 'string',
    description:
      'The full name of the user. Normally this is populated for government agencies.',
    required: false,
    nullable: true,
  })
  fullName?: string | null;

  static fromUserProfile(user: UserProfile): AuthorDto {
    return {
      id: user.id,
      username: user.username,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      middleName: user.middleName,
      shortName: user.shortName,
      fullName: user.fullName,
    };
  }
}
