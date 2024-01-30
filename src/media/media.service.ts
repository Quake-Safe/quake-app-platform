import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { DatabaseService } from 'src/common/database/database.service';
import { SupabaseStorageService } from 'src/common/supabase-storage/supabase-storage.service';

@Injectable()
export class MediaService {
  constructor(
    private db: DatabaseService,
    private storage: SupabaseStorageService,
  ) {}

  async createOne({
    bucket,
    file,
    input,
  }: {
    bucket: string;
    file: Express.Multer.File;
    input: Prisma.MediaCreateInput;
  }) {
    const publicUrl = await this.storage.uploadFile(
      bucket,
      input.fileName,
      file.buffer,
    );

    const media = await this.db.media.create({
      data: {
        ...input,
        publicUrl,
      },
    });

    return media;
  }

  async deleteOne({
    bucket,
    where,
  }: {
    bucket: string;
    where: Prisma.MediaWhereUniqueInput;
  }) {
    const mediaToDelete = await this.db.media.findUnique({
      where: where,
    });

    if (!mediaToDelete) {
      throw new Error('Media not found');
    }

    await this.storage.deleteFile(bucket, mediaToDelete.fileName);

    return await this.db.media.delete({
      where: where,
    });
  }
}
