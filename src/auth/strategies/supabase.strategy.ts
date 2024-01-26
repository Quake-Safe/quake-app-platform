import { Inject } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { SupabaseAuthStrategy } from 'nestjs-supabase-auth';
import { ExtractJwt } from 'passport-jwt';

export class SupabaseSrategy extends PassportStrategy(
  SupabaseAuthStrategy,
  'supabase',
) {
  constructor(@Inject(ConfigService) configService: ConfigService) {
    super({
      supabaseKey: configService.get('SUPABASE_KEY') ?? '',
      supabaseUrl: configService.get('SUPABASE_URL') ?? '',
      supabaseOptions: {},
      supabaseJwtSecret: configService.get('SUPABASE_JWT_SECRET'),
      extractor: ExtractJwt.fromAuthHeaderAsBearerToken(),
    });
  }

  async validate(payload: any): Promise<any> {
    super.validate(payload);
  }

  authenticate(req: any) {
    super.authenticate(req);
  }
}
