import { Injectable } from '@nestjs/common';
import { AuthError } from '@supabase/supabase-js';
import { SupabaseService } from 'src/common/supabase/supabase.service';

@Injectable()
export class AuthService {
  constructor(private supabaseService: SupabaseService) {}

  async login(email: string, password: string) {
    try {
      const response =
        await this.supabaseService.client.auth.signInWithPassword({
          email,
          password,
        });

      if (response.error) {
        throw response.error;
      }

      return response.data.user;
    } catch (error) {
      if (error instanceof AuthError) {
        throw new Error(error.message);
      }

      throw Error('Something went wrong.');
    }
  }
}
