import { UserProfile } from '@prisma/client';

export interface RequestWithUser extends Request {
  user: UserProfile;
}
