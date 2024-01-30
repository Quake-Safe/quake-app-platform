import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { SupabaseModule } from './supabase/supabase.module';
import { SupabaseStorageModule } from './supabase-storage/supabase-storage.module';

@Module({
  imports: [DatabaseModule, SupabaseModule, SupabaseStorageModule],
  exports: [DatabaseModule, SupabaseModule, SupabaseStorageModule],
  providers: [],
})
export class CommonModule {}
