import { Injectable } from '@nestjs/common';
import { AuthError } from '@supabase/supabase-js';
import { SupabaseService } from 'src/common/supabase/supabase.service';

@Injectable()
export class AuthService {
  constructor(private supabaseService: SupabaseService) {}

  async register(
    email: string,
    password: string,
    data: {
      username: string;
    },
  ) {
    try {
      const response = await this.supabaseService.client.auth.signUp({
        email,
        password,
        options: {
          data,
        },
      });

      if (response.error) {
        throw response.error;
      }

      if (!response.data.user) {
        throw new Error('Something went wrong.');
      }

      // Login user after registration
      const {
        data: { session, user },
      } = await this.supabaseService.client.auth.signInWithPassword({
        email,
        password,
      });

      if (!session) {
        throw new Error('Something went wrong.');
      }

      if (!user) {
        throw new Error('Something went wrong.');
      }

      return {
        session: session,
        user: user,
      };
    } catch (error) {
      if (error instanceof AuthError) {
        throw new Error(error.message);
      }

      throw Error('Something went wrong.');
    }
  }

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

      return response.data;
    } catch (error) {
      if (error instanceof AuthError) {
        throw new Error(error.message);
      }

      throw Error('Something went wrong.');
    }
  }
}
