import { Module } from '@nestjs/common';
import { PostService } from './post.service';
import { PostController } from './post.controller';
import { CommonModule } from 'src/common/common.module';
import { MediaModule } from 'src/media/media.module';

@Module({
  imports: [CommonModule, MediaModule],
  providers: [PostService],
  controllers: [PostController],
})
export class PostModule {}
