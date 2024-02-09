import { Module } from '@nestjs/common';
import { CommonModule } from 'src/common/common.module';
import { PostCommentService } from './post-comment.service';
import { PostCommentController } from './post-comment.controller';
import { PostModule } from 'src/post/post.module';

@Module({
  imports: [CommonModule, PostModule],
  providers: [PostCommentService],
  exports: [PostCommentService],
  controllers: [PostCommentController],
})
export class PostCommentModule {}
