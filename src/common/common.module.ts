import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { SupabaseModule } from './supabase/supabase.module';

@Module({
  imports: [DatabaseModule, SupabaseModule],
  exports: [DatabaseModule],
})
export class CommonModule {}
