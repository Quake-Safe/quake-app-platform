import { Inject } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import {
  AuthUser as SupabaseAuthUser,
  SupabaseClient,
  createClient,
} from '@supabase/supabase-js';
import { Request } from 'express';
import { ExtractJwt, JwtFromRequestFunction } from 'passport-jwt';
import { Strategy } from 'passport-strategy';
import { DatabaseService } from 'src/common/database/database.service';

export class SupabaseStrategy extends PassportStrategy(Strategy, 'supabase') {
  readonly name = 'SUPABASE_AUTH';

  private supabase: SupabaseClient;
  private extractor: JwtFromRequestFunction<Request>;
  success: (user: any, info: any) => void;
  fail: Strategy['fail'];

  constructor(
    @Inject(ConfigService) configService: ConfigService,
    @Inject(DatabaseService) private db: DatabaseService,
  ) {
    super();

    this.supabase = createClient(
      configService.get('SUPABASE_URL') ?? '',
      configService.get('SUPABASE_KEY') ?? '',
      {},
    );

    this.extractor =
      ExtractJwt.fromAuthHeaderAsBearerToken() as unknown as JwtFromRequestFunction<Request>;
  }

  async validate(payload: SupabaseAuthUser): Promise<SupabaseAuthUser> {
    return payload;
  }

  async authenticate(req: Request): Promise<void> {
    const idToken = this.extractor(req);

    if (!idToken) {
      this.fail('Unauthorized', 401);
      return;
    }

    const response = await this.supabase.auth.getUser(idToken);
    if (response.error) {
      this.fail('Unauthorized', 401);
      return;
    }

    const result = await this.validate(response.data.user);
    if (!result) {
      this.fail('Unauthorized', 401);
      return;
    }
    const user = await this.db.userProfile.findFirst({
      where: {
        supabaseId: result.id,
      },
    });

    this.success(user, {});
  }
}
