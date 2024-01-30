import { ApiProperty } from '@nestjs/swagger';
import { Post, Prisma } from '@prisma/client';
import { PostMediaDto } from './post-media.dto';
import { PostAuthorDto } from './post-author.dto';

export class PostDto implements Post {
  @ApiProperty()
  id: string;
  @ApiProperty({
    type: 'string',
  })
  createdAt: Date;
  @ApiProperty({
    type: 'string',
  })
  updatedAt: Date;
  @ApiProperty({
    type: 'string',
    nullable: true,
    required: false,
  })
  deletedAt: Date | null;
  @ApiProperty()
  title: string;
  @ApiProperty()
  content: string;

  @ApiProperty()
  mediaId: string;

  @ApiProperty()
  authorId: string;
  @ApiProperty({
    type: PostMediaDto,
  })
  media: PostMediaDto;

  @ApiProperty({
    type: PostAuthorDto,
  })
  author: PostAuthorDto;

  public static fromPost(
    post: Prisma.PostGetPayload<{
      include: {
        author: true;
        media: true;
      };
    }>,
  ) {
    const dto = new PostDto();
    dto.id = post.id;
    dto.createdAt = post.createdAt;
    dto.updatedAt = post.updatedAt;
    dto.deletedAt = post.deletedAt;
    dto.title = post.title;
    dto.content = post.content;
    dto.mediaId = post.mediaId;
    dto.authorId = post.authorId;

    dto.media = PostMediaDto.fromMedia(post.media);
    dto.author = PostAuthorDto.fromUser(post.author);

    return dto;
  }
}
