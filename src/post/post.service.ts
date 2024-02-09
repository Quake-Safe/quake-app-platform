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

  async getAllPaginated({
    where,
    limit = 10,
    page = 1,
  }: {
    where: Prisma.PostWhereInput;
    limit?: number;
    page?: number;
  }) {
    return this.db.paginated.post
      .paginate({
        where: where,
        include: {
          author: true,
          media: true,
        },
      })
      .withPages({
        includePageCount: true,
        limit: limit,
        page: page,
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

  async hasUserLikedPost({
    userId,
    postId,
  }: {
    userId: string;
    postId: string;
  }) {
    const postLike = await this.db.userLikes.findFirst({
      where: {
        authorId: userId,
        postId: postId,
      },
    });

    console.log('Post Like: ', postLike);

    return postLike !== null;
  }

  async likePost({ userId, postId }: { userId: string; postId: string }) {
    return this.db.$transaction(async (db) => {
      await db.userLikes.create({
        data: {
          authorId: userId,
          postId: postId,
        },
      });

      const post = await this.db.post.update({
        data: {
          totalLikes: {
            increment: 1,
          },
        },
        where: {
          id: postId,
        },
        include: {
          author: true,
          media: true,
        },
      });

      return post;
    });
  }

  async unlikePost({ userId, postId }: { userId: string; postId: string }) {
    return this.db.$transaction(async (db) => {
      const like = await db.userLikes.findFirst({
        where: {
          authorId: userId,
          postId: postId,
        },
      });

      if (!like) {
        throw new Error('Like not found');
      }

      const post = await this.db.post.update({
        data: {
          totalLikes: {
            decrement: 1,
          },
        },
        where: {
          id: postId,
        },
        include: {
          author: true,
          media: true,
        },
      });

      await db.userLikes.delete({
        where: {
          id: like.id,
        },
      });

      return post;
    });
  }

  async getAllUserLikes(userId: string) {
    return this.db.userLikes.findMany({
      where: {
        authorId: userId,
      },
    });
  }

  async incrementCommentCount({
    amount,
    postId,
  }: {
    amount: number;
    postId: string;
  }) {
    return this.db.post.update({
      data: {
        totalComments: {
          increment: amount,
        },
      },
      where: {
        id: postId,
      },
    });
  }

  async decrementCommentCount({
    amount,
    postId,
  }: {
    amount: number;
    postId: string;
  }) {
    return this.db.post.update({
      data: {
        totalComments: {
          decrement: amount,
        },
      },
      where: {
        id: postId,
      },
    });
  }
}
