import { Module } from '@nestjs/common';
import { PostService } from './post.service';
import { PostController } from './post.controller';
import { DatabaseService } from 'src/common/database/database.service';

@Module({
  providers: [PostService, DatabaseService],
  controllers: [PostController],
})
export class PostModule {}
