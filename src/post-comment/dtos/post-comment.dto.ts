import { ApiProperty } from '@nestjs/swagger';
import { Prisma } from '@prisma/client';
import { AuthorDto } from 'src/common/dtos/author.dto';

type PostCommentWithAuthorAndReplies = Prisma.PostCommentGetPayload<{
  include: {
    author: true;
    likes: true;
    children: {
      select: {
        id: true;
      };
    };
  };
}>;

type PostCommentWithAuthor = Prisma.PostCommentGetPayload<{
  include: {
    author: true;
    likes: true;
  };
}>;

export class PostCommentDto {
  @ApiProperty({
    type: 'string',
    required: true,
    description: 'The id of the comment.',
  })
  id: string;
  @ApiProperty({
    type: Date,
    required: true,
    description: 'The date the comment was created.',
    example: '2021-08-01T00:00:00.000Z',
  })
  createdAt: Date;
  @ApiProperty({
    type: Date,
    required: true,
    description: 'The date the comment was last updated.',
    example: '2021-08-01T00:00:00.000Z',
  })
  updatedAt: Date;
  @ApiProperty({
    type: Date,
    required: false,
    nullable: true,
    description: 'The date the comment was deleted.',
    example: '2021-08-01T00:00:00.000Z',
  })
  deletedAt: Date | null;

  @ApiProperty({
    type: 'string',
    required: true,
    description: 'The content of the comment.',
  })
  content: string;

  @ApiProperty({
    type: 'string',
    required: true,
    description: 'The id of the author of this comment.',
  })
  authorId: string;

  @ApiProperty({ type: AuthorDto, description: 'The author of this comment' })
  author: AuthorDto;

  @ApiProperty({
    type: 'string',
    required: true,
    description: 'The id of the post this comment belongs to.',
  })
  postId: string;

  @ApiProperty({
    type: 'string',
    required: false,
    nullable: true,
    description: 'The id of the parent comment.',
  })
  parentId?: string | null;

  @ApiProperty({
    type: 'number',
    default: 0,
    required: false,
    description: 'The total number of likes to this comment.',
  })
  totalLikes: number = 0;

  @ApiProperty({
    type: 'number',
    default: 0,
    required: false,
    description: 'The total number of replies to this comment.',
  })
  totalReplies: number = 0;

  @ApiProperty({
    type: 'boolean',
    default: false,
    required: false,
    description: 'Whether the current user has liked this comment.',
  })
  hasLiked: boolean = false;

  static fromPostComment(postComment: PostCommentWithAuthor) {
    const comment = new PostCommentDto();
    comment.id = postComment.id;
    comment.createdAt = postComment.createdAt;
    comment.updatedAt = postComment.updatedAt;
    comment.deletedAt = postComment.deletedAt;
    comment.content = postComment.content;
    comment.authorId = postComment.author.id;
    comment.author = AuthorDto.fromUserProfile(postComment.author);
    comment.postId = postComment.postId;
    comment.totalLikes = postComment.likes.length;
    comment.totalReplies = 0;

    return comment;
  }

  static fromPostCommentExtended(
    postComment: PostCommentWithAuthorAndReplies,
  ): PostCommentDto {
    const comment = new PostCommentDto();
    comment.id = postComment.id;
    comment.createdAt = postComment.createdAt;
    comment.updatedAt = postComment.updatedAt;
    comment.deletedAt = postComment.deletedAt;
    comment.content = postComment.content;
    comment.authorId = postComment.author.id;
    comment.author = AuthorDto.fromUserProfile(postComment.author);
    comment.postId = postComment.postId;

    comment.totalLikes = postComment.likes.length;
    comment.totalReplies = postComment.children.length;

    comment.hasLiked = false;
    return comment;
  }
}
