import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserModule } from 'src/user/user.module';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './auth.controller';
import { SupabaseSrategy } from './strategies/supabase.strategy';

@Module({
  imports: [UserModule, PassportModule],
  providers: [AuthService, SupabaseSrategy],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
