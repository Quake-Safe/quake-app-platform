import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class PostCommentCreateOneDto {
  @ApiProperty({
    description: 'The content of the comment.',
  })
  @IsNotEmpty()
  content: string;

  @ApiProperty({
    description: 'The id of the post to create the comment for.',
  })
  @IsNotEmpty()
  postId: string;

  @ApiProperty({
    description: 'The id of the parent comment.',
    required: false,
    nullable: true,
  })
  parentId?: string;
}
