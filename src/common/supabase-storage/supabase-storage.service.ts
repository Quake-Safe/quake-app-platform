import { Injectable } from '@nestjs/common';
import { SupabaseClient } from '@supabase/supabase-js';
import { SupabaseService } from '../supabase/supabase.service';

@Injectable()
export class SupabaseStorageService {
  private supabase: SupabaseClient;

  constructor(supabaseService: SupabaseService) {
    this.supabase = supabaseService.client;
  }

  async isBucketExists(bucket: string): Promise<boolean> {
    const { error } = await this.supabase.storage.getBucket(bucket);

    if (error && error.message === 'Bucket not found') {
      return false;
    }

    if (error) {
      throw error;
    }

    return true;
  }

  /**
   *
   * @param bucket  The name of the bucket to create.
   * @param token  The jwt token to use for authentication.
   */
  async createBucket(bucket: string): Promise<void> {
    const { error } = await this.supabase.storage.createBucket(bucket, {
      public: true,
    });

    if (error) {
      throw error;
    }
  }

  async isFileExists(bucket: string, fileName: string): Promise<boolean> {
    const { data, error } = await this.supabase.storage
      .from(bucket)
      .list('', { limit: 1 });

    if (error) {
      throw error;
    }

    if (!data) {
      return false;
    }

    if (data.length === 0) {
      return false;
    }

    return data.some((file) => file.name === fileName);
  }

  async deleteFile(bucket: string, filePath: string): Promise<void> {
    const { error } = await this.supabase.storage
      .from(bucket)
      .remove([filePath]);

    if (error) {
      throw error;
    }
  }

  async uploadFile(
    bucket: string,
    filePath: string,
    file: Buffer,
  ): Promise<string> {
    const isExistingBucket = await this.isBucketExists(bucket);

    if (!isExistingBucket) {
      await this.createBucket(bucket);
    }

    const uploadResponse = await this.supabase.storage
      .from(bucket)
      .upload(filePath, file);

    if (uploadResponse.error) {
      throw uploadResponse.error;
    }

    const publicUrlResponse = this.supabase.storage
      .from(bucket)
      .getPublicUrl(filePath);

    return publicUrlResponse.data.publicUrl;
  }
}
