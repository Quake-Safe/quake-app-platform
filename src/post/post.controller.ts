import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  Request,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { PostService } from './post.service';
import {
  ApiBearerAuth,
  ApiConsumes,
  ApiOkResponse,
  ApiParam,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { SupabaseAuthGuard } from 'src/auth/guards/supabase-auth.guard';
import { ApiCreatedResponseCommon } from 'src/common/decorators/api-created-response-decorator';
import { RequestWithUser } from 'src/common/interfaces/request-with-user.interface';
import { PostCreateOneDto } from './dtos/post-create-one.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiOkArrayResponseCommon } from 'src/common/decorators/api-ok-array-response-decorator';
import { PostDto } from './dtos/post-dto';
import { ApiResponseDto } from 'src/common/dtos/api-response-dto';
import { ApiOkResponseCommon } from 'src/common/decorators/api-ok-response-decorator';
@ApiTags('Post')
@Controller('post')
export class PostController {
  constructor(private postService: PostService) {}

  @Post('/create')
  @ApiBearerAuth()
  @UseGuards(SupabaseAuthGuard)
  @UseInterceptors(FileInterceptor('thumbnail'))
  @ApiConsumes('multipart/form-data')
  @ApiCreatedResponseCommon(PostDto)
  async create(
    @Request() req: RequestWithUser,
    @Body() createOneDto: PostCreateOneDto,
    @UploadedFile() thumbnail: Express.Multer.File,
  ) {
    try {
      const post = await this.postService.createOne(
        {
          content: createOneDto.content,
          title: createOneDto.title,
          author: {
            connect: {
              id: req.user.id,
            },
          },
        },
        thumbnail,
      );

      return ApiResponseDto.success(PostDto.fromPost(post));
    } catch (error) {
      return ApiResponseDto.error(error);
    }
  }

  @Get('/')
  @ApiQuery({
    name: 'author',
    description: 'The author id of the posts.',
    required: false,
  })
  @ApiOkArrayResponseCommon(PostDto)
  async getAll(@Query('author') author?: string) {
    try {
      const posts = await this.postService.getAll({
        author: {
          id: author,
        },
      });

      return ApiResponseDto.success(
        posts.map((post) => PostDto.fromPost(post)),
      );
    } catch (error) {
      return ApiResponseDto.error(error);
    }
  }

  @Delete('/:id')
  @ApiBearerAuth()
  @UseGuards(SupabaseAuthGuard)
  @ApiParam({
    name: 'id',
    description: 'The id of the post to be deleted.',
  })
  @ApiOkResponseCommon(PostDto)
  async deleteOne(@Request() req: RequestWithUser, @Param('id') id: string) {
    try {
      const post = await this.postService.getOne({
        id: id,
      });

      if (!post) {
        throw new Error('Post not found');
      }

      if (post.authorId !== req.user.id) {
        throw new Error('You are not allowed to delete this post');
      }

      const deletedPost = await this.postService.deleteOne({
        id: id,
      });

      return ApiResponseDto.success(PostDto.fromPost(deletedPost));
    } catch (error) {
      return ApiResponseDto.error(String(error));
    }
  }
}
