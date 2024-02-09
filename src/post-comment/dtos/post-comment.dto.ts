import { ApiProperty, getSchemaPath } from '@nestjs/swagger';
import { Prisma } from '@prisma/client';
import { AuthorDto } from 'src/common/dtos/author.dto';

type PostCommentWithAuthorAndReplies = Prisma.PostCommentGetPayload<{
  include: {
    author: true;
    likes: true;
    children: {
      include: {
        author: true;
        likes: true;
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

  @ApiProperty({ type: AuthorDto })
  author: AuthorDto;

  @ApiProperty()
  postId: string;

  @ApiProperty({
    type: 'array',
    items: {
      $ref: getSchemaPath(PostCommentDto),
    },
    required: false,
    nullable: true,
  })
  replies: PostCommentDto[] = [];

  @ApiProperty({
    type: 'string',
    required: false,
    nullable: true,
  })
  parentId?: string | null;

  @ApiProperty({
    type: 'number',
    default: 0,
    required: false,
  })
  totalLikes: number = 0;

  @ApiProperty({
    type: 'number',
    default: 0,
    required: false,
  })
  totalReplies: number = 0;

  @ApiProperty({
    type: 'boolean',
    default: false,
    required: false,
  })
  hasLiked: boolean = false;

  @ApiProperty({
    type: 'boolean',
    default: false,
    required: false,
  })
  hasReplied: boolean = false;

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

    return comment;
  }

  static fromPostCommentExtended(postComment: PostCommentWithAuthorAndReplies) {
    const comment = new PostCommentDto();
    comment.id = postComment.id;
    comment.createdAt = postComment.createdAt;
    comment.updatedAt = postComment.updatedAt;
    comment.deletedAt = postComment.deletedAt;
    comment.content = postComment.content;
    comment.authorId = postComment.author.id;

    comment.author = AuthorDto.fromUserProfile(postComment.author);
    comment.postId = postComment.postId;
    comment.replies = postComment.children.map((child) =>
      PostCommentDto.fromPostComment(child),
    );
    comment.totalLikes = postComment.likes.length;
    comment.totalReplies = postComment.children.length;
    return comment;
  }
}
