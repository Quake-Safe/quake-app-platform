import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class PostCommentCreateOneDto {
  @ApiProperty({
    description: 'The content of the comment.',
  })
  @IsNotEmpty()
  content: string;
}
