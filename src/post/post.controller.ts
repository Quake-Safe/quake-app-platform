import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Request,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { PostService } from './post.service';
import { ApiBearerAuth, ApiConsumes, ApiQuery } from '@nestjs/swagger';
import { SupabaseAuthGuard } from 'src/auth/guards/supabase-auth.guard';
import { ApiCreatedResponseCommon } from 'src/common/decorators/api-created-response-decorator';
import { RequestWithUser } from 'src/common/interfaces/request-with-user.interface';
import { PostCreateOneDto } from './dtos/post-create-one.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiOkArrayResponseCommon } from 'src/common/decorators/api-ok-array-response-decorator';
import { PostDto } from './dtos/post-dto';
import { ApiResponseDto } from 'src/common/dtos/api-response-dto';

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
    const post = await this.postService.createOne(
      {
        content: createOneDto.content,
        title: createOneDto.title,
        author: {
          connect: {
            supabaseId: req.user.id,
          },
        },
      },
      thumbnail,
    );

    return post;
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
      const posts = await this.postService.getAll(
        {
          author: {
            id: author,
          },
        },
        undefined,
      );

      return ApiResponseDto.success(posts);
    } catch (error) {
      return ApiResponseDto.error(error);
    }
  }
}
