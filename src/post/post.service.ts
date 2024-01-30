import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { DatabaseService } from 'src/common/database/database.service';
import { SupabaseStorageService } from 'src/common/supabase-storage/supabase-storage.service';

@Injectable()
export class PostService {
  BUCKET_NAME = 'post_thumbnail';

  constructor(
    private db: DatabaseService,
    private storageService: SupabaseStorageService,
  ) {}

  async createOne(
    input: Prisma.PostCreateInput,
    thumbnail: Express.Multer.File,
  ) {
    const now = new Date();
    const extension = thumbnail.originalname.split('.').pop();
    const thumbnailUrl = await this.storageService.uploadFile(
      this.BUCKET_NAME,
      `${now.getTime()}.${extension}`,
      thumbnail.buffer,
    );

    return this.db.post.create({
      data: {
        ...input,
        thumbnailUrl,
      },
    });
  }

  async deleteOne(where: Prisma.PostWhereUniqueInput) {
    return this.db.post.delete({
      where,
    });
  }

  async updateOne(
    where: Prisma.PostWhereUniqueInput,
    input: Prisma.PostUpdateInput,
  ) {
    return this.db.post.update({
      where,
      data: input,
    });
  }

  async getAll(where: Prisma.PostWhereInput, select?: Prisma.PostSelect) {
    return this.db.post.findMany({
      where,
      select,
    });
  }

  async getOne(where: Prisma.PostWhereUniqueInput, select?: Prisma.PostSelect) {
    return this.db.post.findUnique({
      where,
      select,
    });
  }
}
