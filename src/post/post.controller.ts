import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
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
import { ApiOkArrayResponseCommon } from 'src/common/decorators/api-ok-array-response-decorator';
import { PostDto } from './dtos/post-dto';
import { ApiResponseDto } from 'src/common/dtos/api-response-dto';
import { ApiOkResponseCommon } from 'src/common/decorators/api-ok-response-decorator';
import { RoleAuthGuard } from 'src/auth/guards/role-auth.guard';
import { AuthRoles } from 'src/auth/reflectors/auth-roles.reflector';
import { PostCommentService } from 'src/post-comment/post-comment.service';
import { PostCommentDto } from 'src/post-comment/dtos/post-comment.dto';
import { PostCommentCreateOneDto } from 'src/post-comment/dtos/post-comment-create-one.dto';
import { PostCommentUpdateOneDto } from 'src/post-comment/dtos/post-comment-update-one.dto';
@ApiTags('Post')
@ApiBearerAuth()
@UseGuards(SupabaseAuthGuard)
@Controller('post')
export class PostController {
  constructor(
    private postService: PostService,
    private commentsService: PostCommentService,
  ) {}

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
  @ApiOkArrayResponseCommon(PostDto)
  async getAll(
    @Request() req: RequestWithUser,
    @Query('author') author?: string,
  ) {
    try {
      const posts = await this.postService.getAll({
        author: {
          id: author,
        },
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

      return ApiResponseDto.success(postDtos);
    } catch (error) {
      return ApiResponseDto.error(error);
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

  @Get('/:id/comments')
  @ApiParam({
    name: 'id',
    description: 'The id of the post to get comments from.',
  })
  @ApiOkArrayResponseCommon(PostCommentDto)
  async getAllCommentsFromPost(
    @Request() req: RequestWithUser,
    @Param('id') id: string,
  ) {
    try {
      const comments = await this.commentsService.getAll({
        where: {
          postId: id,
        },
      });

      return ApiResponseDto.success(
        comments.map((comment) => PostCommentDto.fromPostComment(comment)),
      );
    } catch (error) {
      return ApiResponseDto.error(error);
    }
  }

  @Post('/:id/comments')
  @ApiParam({
    name: 'id',
    description: 'The id of the post to create a comment for.',
  })
  @ApiCreatedResponseCommon(PostCommentDto)
  async createComment(
    @Request() req: RequestWithUser,
    @Param('id') id: string,
    @Body() createOneDto: PostCommentCreateOneDto,
  ) {
    try {
      const comment = await this.commentsService.createOne({
        content: createOneDto.content,
        author: {
          connect: {
            id: req.user.id,
          },
        },
        post: {
          connect: {
            id: id,
          },
        },
      });

      await this.postService.incrementCommentCount({
        postId: id,
        amount: 1,
      });

      return ApiResponseDto.success(PostCommentDto.fromPostComment(comment));
    } catch (error) {
      return ApiResponseDto.error(error);
    }
  }

  @Delete('/:id/comments/:commentId')
  @ApiParam({
    name: 'id',
    description: 'The id of the post to delete a comment from.',
  })
  @ApiParam({
    name: 'commentId',
    description: 'The id of the comment to be deleted.',
  })
  @ApiOkResponseCommon(PostCommentDto)
  async deleteComment(
    @Request() req: RequestWithUser,
    @Param('id') id: string,
    @Param('commentId') commentId: string,
  ) {
    try {
      const comment = await this.commentsService.getOne({
        id: commentId,
      });

      if (!comment) {
        throw new Error('Comment not found');
      }

      if (comment.authorId !== req.user.id) {
        throw new Error('You are not allowed to delete this comment');
      }

      const deletedComment = await this.commentsService.deleteOne({
        id: commentId,
      });

      await this.postService.decrementCommentCount({
        postId: id,
        amount: 1,
      });

      return ApiResponseDto.success(
        PostCommentDto.fromPostComment(deletedComment),
      );
    } catch (error) {
      return ApiResponseDto.error(String(error));
    }
  }

  @Patch('/:id/comments/:commentId/')
  @ApiParam({
    name: 'id',
    description: 'The id of the post to update a comment from.',
  })
  @ApiParam({
    name: 'commentId',
    description: 'The id of the comment to be updated.',
  })
  @ApiOkResponseCommon(PostCommentDto)
  async updateComment(
    @Request() req: RequestWithUser,
    @Param('id') id: string,
    @Param('commentId') commentId: string,
    @Body() updateOneDto: PostCommentUpdateOneDto,
  ) {
    try {
      const comment = await this.commentsService.getOne({
        id: commentId,
      });

      if (!comment) {
        throw new Error('Comment not found');
      }

      if (comment.authorId !== req.user.id) {
        throw new Error('You are not allowed to update this comment');
      }

      const updatedComment = await this.commentsService.updateOne({
        where: {
          id: commentId,
        },
        input: {
          content: updateOneDto.content,
        },
      });

      return ApiResponseDto.success(
        PostCommentDto.fromPostComment(updatedComment),
      );
    } catch (error) {
      return ApiResponseDto.error(String(error));
    }
  }
}
