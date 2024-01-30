import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { DatabaseService } from 'src/common/database/database.service';
import { MediaService } from 'src/media/media.service';

@Injectable()
export class PostService {
  BUCKET_NAME = 'post_thumbnail';

  constructor(
    private db: DatabaseService,
    private mediaService: MediaService,
  ) {}

  async createOne(
    input: Prisma.PostCreateWithoutMediaInput,
    thumbnail: Express.Multer.File,
  ) {
    const now = new Date();
    const extension = thumbnail.originalname.split('.').pop();
    const fileName = `${now.getTime()}.${extension}`;

    const media = await this.mediaService.createOne({
      bucket: this.BUCKET_NAME,
      file: thumbnail,
      input: {
        fileName,
        originalFileName: thumbnail.originalname,
        type: 'IMAGE',
        // Will be replaced by the publicUrl returned by the storage service.
        publicUrl: '',
      },
    });

    return this.db.post.create({
      data: {
        ...input,
        media: {
          connect: {
            id: media.id,
          },
        } satisfies Prisma.MediaCreateNestedOneWithoutPostInput,
      },
      include: {
        author: true,
        media: true,
      },
    });
  }

  async deleteOne(where: Prisma.PostWhereUniqueInput) {
    const postToDelete = await this.db.post.findUnique({
      where,
    });

    if (!postToDelete) {
      throw new Error('Post not found');
    }

    const post = await this.db.post.delete({
      where,
      include: {
        author: true,
        media: true,
      },
    });

    await this.mediaService.deleteOne({
      bucket: this.BUCKET_NAME,
      where: {
        id: postToDelete.mediaId,
      },
    });

    return post;
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

  async getAll(where: Prisma.PostWhereInput) {
    return this.db.post.findMany({
      where,
      include: {
        author: true,
        media: true,
      },
    });
  }

  async getOne(where: Prisma.PostWhereUniqueInput) {
    return this.db.post.findUnique({
      where,
      include: {
        author: true,
        media: true,
      },
    });
  }
}
