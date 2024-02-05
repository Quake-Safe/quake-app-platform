import { Module } from '@nestjs/common';
import { PostService } from './post.service';
import { PostController } from './post.controller';
import { CommonModule } from 'src/common/common.module';
import { MediaModule } from 'src/media/media.module';
import { PostCommentModule } from 'src/post-comment/post-comment.module';

@Module({
  imports: [CommonModule, MediaModule, PostCommentModule],
  providers: [PostService],
  controllers: [PostController],
})
export class PostModule {}
