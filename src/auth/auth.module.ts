import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserModule } from 'src/user/user.module';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './auth.controller';
import { SupabaseStrategy } from './strategies/supabase.strategy';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from 'src/common/database/database.module';

@Module({
  imports: [UserModule, PassportModule, ConfigModule, DatabaseModule],
  providers: [AuthService, SupabaseStrategy],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
