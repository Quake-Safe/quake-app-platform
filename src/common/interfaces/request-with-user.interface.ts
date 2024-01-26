import { AuthUser } from '@supabase/supabase-js';

export interface RequestWithUser extends Request {
  user: AuthUser;
}
