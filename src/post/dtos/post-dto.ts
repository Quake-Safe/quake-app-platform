import { ApiProperty } from '@nestjs/swagger';
import { Post } from '@prisma/client';

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
  authorId: string;
  @ApiProperty({
    type: 'string',
    required: false,
    nullable: true,
  })
  thumbnailUrl: string | null;
}
