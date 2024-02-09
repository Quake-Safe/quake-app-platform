import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { DatabaseService } from 'src/common/database/database.service';

@Injectable()
export class PostCommentService {
  constructor(private db: DatabaseService) {}

  async getOne(where: Prisma.PostCommentWhereUniqueInput) {
    return this.db.postComment.findUnique({
      where: where,
    });
  }

  async getAll({ where }: { where: Prisma.PostCommentWhereInput }) {
    return this.db.postComment.findMany({
      where: where,
      include: {
        author: true,
        children: {
          include: {
            author: true,
            likes: true,
          },
        },
        likes: true,
      },
    });
  }

  async getAllPaginated({
    where,
    limit = 10,
    page = 1,
  }: {
    where: Prisma.PostCommentWhereInput;
    limit: number;
    page: number;
  }) {
    return this.db.paginated.postComment
      .paginate({
        where: where,
        include: {
          author: true,
          children: {
            include: {
              author: true,
              likes: true,
            },
          },
          likes: true,
        },
      })
      .withPages({
        includePageCount: true,
        limit: limit,
        page: page,
      });
  }

  async createOne(input: Prisma.PostCommentCreateInput) {
    return this.db.postComment.create({
      data: input,
      include: {
        author: true,
        likes: true,
      },
    });
  }

  async deleteOne(where: Prisma.PostCommentWhereUniqueInput) {
    return this.db.postComment.delete({
      where: where,
      include: {
        author: true,
        likes: true,
      },
    });
  }

  async updateOne({
    input,
    where,
  }: {
    input: Prisma.PostCommentUpdateInput;
    where: Prisma.PostCommentWhereUniqueInput;
  }) {
    return this.db.postComment.update({
      data: input,
      where: where,
      include: {
        author: true,
        likes: true,
      },
    });
  }

  async hasLikedComment({
    userId,
    commentId,
  }: {
    userId: string;
    commentId: string;
  }) {
    return this.db.userLikes.findFirst({
      where: {
        authorId: userId,
        commentId: commentId,
      },
    });
  }

  async likeComment({
    commentId,
    userId,
  }: {
    userId: string;
    commentId: string;
  }) {
    return await this.db.userLikes.create({
      data: {
        authorId: userId,
        commentId: commentId,
      },
    });
  }

  async unlikeComment({
    commentId,
    userId,
  }: {
    userId: string;
    commentId: string;
  }) {
    return await this.db.userLikes.deleteMany({
      where: {
        authorId: userId,
        commentId: commentId,
      },
    });
  }
}
