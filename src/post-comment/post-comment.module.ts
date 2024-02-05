import { Module } from '@nestjs/common';
import { CommonModule } from 'src/common/common.module';
import { PostCommentService } from './post-comment.service';

@Module({
  imports: [CommonModule],
  providers: [PostCommentService],
  exports: [PostCommentService],
})
export class PostCommentModule {}
