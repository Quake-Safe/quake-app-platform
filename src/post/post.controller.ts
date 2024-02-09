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
  ApiParam,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { SupabaseAuthGuard } from 'src/auth/guards/supabase-auth.guard';
import { ApiCreatedResponseCommon } from 'src/common/decorators/api-created-response-decorator';
import { RequestWithUser } from 'src/common/interfaces/request-with-user.interface';
import { PostCreateOneDto } from './dtos/post-create-one.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { PostDto } from './dtos/post-dto';
import { ApiResponseDto } from 'src/common/dtos/api-response-dto';
import { ApiOkResponseCommon } from 'src/common/decorators/api-ok-response-decorator';
import { RoleAuthGuard } from 'src/auth/guards/role-auth.guard';
import { AuthRoles } from 'src/auth/reflectors/auth-roles.reflector';
import { ApiOkPaginatedResponseCommon } from 'src/common/decorators/api-ok-paginated-response-decorator';
import { PaginationQueryDto } from 'src/common/dtos/pagination-query.dto';
import { ApiPaginatedResponseDto } from 'src/common/dtos/api-paginated-response-dto';
@ApiTags('Post')
@ApiBearerAuth()
@UseGuards(SupabaseAuthGuard)
@Controller('post')
export class PostController {
  constructor(private postService: PostService) {}

  @Post('/create')
  @AuthRoles(['GOVERNMENT_AGENCY'])
  @UseGuards(RoleAuthGuard)
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
  @ApiOkPaginatedResponseCommon(PostDto)
  async getAll(
    @Request() req: RequestWithUser,
    @Query() pagination: PaginationQueryDto,
    @Query('author') author?: string,
  ) {
    try {
      const [posts, meta] = await this.postService.getAllPaginated({
        where: {
          author: {
            id: author,
          },
        },
        limit: pagination?.limit,
        page: pagination?.page,
      });

      const likedPostIds = new Set(
        (await this.postService.getAllUserLikes(req.user.id)).map(
          (like) => like.postId,
        ),
      );

      const postDtos = posts.map((post) => {
        const hasLiked = likedPostIds.has(post.id);

        return PostDto.fromPost(post, hasLiked);
      });

      return ApiPaginatedResponseDto.success(postDtos, {
        currentPage: meta.currentPage,
        perPage: pagination?.limit ?? 10,
        lastPage: meta.pageCount,
        next: meta.nextPage,
        prev: meta.previousPage,
        total: meta.totalCount,
      });
    } catch (error) {
      return ApiPaginatedResponseDto.error(String(error));
    }
  }

  @Delete('/:id')
  @AuthRoles(['GOVERNMENT_AGENCY'])
  @UseGuards(RoleAuthGuard)
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

  @Post('/:id/like')
  @ApiParam({
    name: 'id',
    description: 'The id of the post to be liked.',
  })
  @ApiOkResponseCommon(String)
  async likePost(@Request() req: RequestWithUser, @Param('id') id: string) {
    try {
      const post = await this.postService.getOne({
        id: id,
      });

      if (!post) {
        throw new Error('Post not found');
      }

      const hasLiked = await this.postService.hasUserLikedPost({
        postId: post.id,
        userId: req.user.id,
      });

      if (hasLiked) {
        throw new Error('You have already liked this post');
      }

      await this.postService.likePost({
        postId: post.id,
        userId: req.user.id,
      });

      return ApiResponseDto.success('Post liked');
    } catch (error) {
      return ApiResponseDto.error(String(error));
    }
  }

  @Delete('/:id/like')
  @ApiParam({
    name: 'id',
    description: 'The id of the post to be unliked.',
  })
  @ApiOkResponseCommon(String)
  async unlikePost(@Request() req: RequestWithUser, @Param('id') id: string) {
    try {
      const post = await this.postService.getOne({
        id: id,
      });

      if (!post) {
        throw new Error('Post not found');
      }

      await this.postService.unlikePost({
        postId: post.id,
        userId: req.user.id,
      });

      return ApiResponseDto.success('Post unliked');
    } catch (error) {
      return ApiResponseDto.error(String(error));
    }
  }
}
