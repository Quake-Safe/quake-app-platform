import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { SupabaseModule } from './supabase/supabase.module';
import { SupabaseStorageService } from './supabase-storage/supabase-storage.service';
import { SupabaseStorageModule } from './supabase-storage/supabase-storage.module';

@Module({
  imports: [DatabaseModule, SupabaseModule, SupabaseStorageModule],
  exports: [DatabaseModule],
  providers: [SupabaseStorageService],
})
export class CommonModule {}
