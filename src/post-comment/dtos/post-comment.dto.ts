import { ApiProperty } from '@nestjs/swagger';
import { PostComment } from '@prisma/client';

export class PostCommentDto {
  @ApiProperty()
  id: string;
  @ApiProperty()
  createdAt: Date;
  @ApiProperty()
  updatedAt: Date;
  @ApiProperty({
    type: Date,
    required: false,
    nullable: true,
  })
  deletedAt: Date | null;
  @ApiProperty()
  content: string;
  @ApiProperty()
  authorId: string;
  @ApiProperty()
  postId: string;

  @ApiProperty()
  parentId?: string | null;

  static fromPostComment(postComment: PostComment): PostCommentDto {
    return {
      id: postComment.id,
      createdAt: postComment.createdAt,
      updatedAt: postComment.updatedAt,
      deletedAt: postComment.deletedAt,
      content: postComment.content,
      authorId: postComment.authorId,
      postId: postComment.postId,
      parentId: postComment.parentId,
    };
  }
}
