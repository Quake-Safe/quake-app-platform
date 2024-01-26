import { ApiProperty } from '@nestjs/swagger';
import {
  Factor,
  User,
  UserAppMetadata,
  UserIdentity,
  UserMetadata,
} from '@supabase/supabase-js';

export class AuthUserDto implements User {
  @ApiProperty()
  id: string;
  @ApiProperty()
  app_metadata: UserAppMetadata;
  @ApiProperty()
  user_metadata: UserMetadata;
  @ApiProperty()
  aud: string;
  @ApiProperty()
  confirmation_sent_at?: string | undefined;
  @ApiProperty()
  recovery_sent_at?: string | undefined;
  @ApiProperty()
  email_change_sent_at?: string | undefined;
  @ApiProperty()
  new_email?: string | undefined;
  @ApiProperty()
  new_phone?: string | undefined;
  @ApiProperty()
  invited_at?: string | undefined;
  @ApiProperty()
  action_link?: string | undefined;
  @ApiProperty()
  email?: string | undefined;
  @ApiProperty()
  phone?: string | undefined;
  @ApiProperty()
  created_at: string;
  @ApiProperty()
  confirmed_at?: string | undefined;
  @ApiProperty()
  email_confirmed_at?: string | undefined;
  @ApiProperty()
  phone_confirmed_at?: string | undefined;
  @ApiProperty()
  last_sign_in_at?: string | undefined;
  @ApiProperty()
  role?: string | undefined;
  @ApiProperty()
  updated_at?: string | undefined;
  @ApiProperty()
  identities?: UserIdentity[] | undefined;
  @ApiProperty()
  factors?: Factor[] | undefined;
}
