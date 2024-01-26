import { Injectable } from '@nestjs/common';
import { PROFILE_IMAGE_BUCKET_NAME } from './constants';
import { SupabaseStorageService } from 'src/common/supabase-storage/supabase-storage.service';
import { UserService } from 'src/user/user.service';

@Injectable()
export class UserProfileService {
  constructor(
    private storageService: SupabaseStorageService,
    private userService: UserService,
  ) {}

  async updateUserProfileImage(userId: string, file: Express.Multer.File) {
    try {
      const isBucketExists = await this.storageService.isBucketExists(
        PROFILE_IMAGE_BUCKET_NAME,
      );

      if (!isBucketExists) {
        await this.storageService.createBucket(PROFILE_IMAGE_BUCKET_NAME);
      }

      const extension = file.originalname.split('.').pop();
      const fileName = `user_${userId}_profile.${extension}`;

      const isFileExists = await this.storageService.isFileExists(
        PROFILE_IMAGE_BUCKET_NAME,
        fileName,
      );

      if (isFileExists) {
        await this.storageService.deleteFile(
          PROFILE_IMAGE_BUCKET_NAME,
          fileName,
        );
      }

      const url = await this.storageService.uploadFile(
        PROFILE_IMAGE_BUCKET_NAME,
        fileName,
        file.buffer,
      );

      await this.userService.updateOne({
        input: {
          avatarUrl: url,
        },
        where: {
          supabaseId: userId,
        },
      });

      return url;
    } catch (error) {
      throw error;
    }
  }
}
