import { Injectable } from '@nestjs/common';
import { UserProfileRole } from '@prisma/client';
import { AuthError } from '@supabase/supabase-js';
import { SupabaseService } from 'src/common/supabase/supabase.service';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthService {
  constructor(
    private supabaseService: SupabaseService,
    private userService: UserService,
  ) {}

  async register(
    email: string,
    password: string,
    data: {
      username: string;
      role: string;
    },
  ) {
    try {
      const response = await this.supabaseService.client.auth.signUp({
        email,
        password,
      });

      if (response.error) {
        throw response.error;
      }

      if (!response.data.user) {
        throw new Error('Something went wrong.');
      }
      // Create a new user profile
      await this.userService.createOne({
        email: email,
        username: data.username,
        role: data.role as UserProfileRole,
        supabaseId: response.data.user.id,
      });

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
