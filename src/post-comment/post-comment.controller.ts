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
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import { ApiOkArrayResponseCommon } from 'src/common/decorators/api-ok-array-response-decorator';
import { RequestWithUser } from 'src/common/interfaces/request-with-user.interface';
import { PostCommentService } from './post-comment.service';
import { PostCommentDto } from './dtos/post-comment.dto';
import { ApiResponseDto } from 'src/common/dtos/api-response-dto';
import { ApiCreatedResponseCommon } from 'src/common/decorators/api-created-response-decorator';
import { PostCommentCreateOneDto } from './dtos/post-comment-create-one.dto';
import { PostService } from 'src/post/post.service';
import { ApiOkResponseCommon } from 'src/common/decorators/api-ok-response-decorator';
import { PostCommentUpdateOneDto } from './dtos/post-comment-update-one.dto';
import { SupabaseAuthGuard } from 'src/auth/guards/supabase-auth.guard';
import { PaginationQueryDto } from 'src/common/dtos/pagination-query.dto';
import { ApiPaginatedResponseDto } from 'src/common/dtos/api-paginated-response-dto';

@ApiTags('Post Comment')
@ApiBearerAuth()
@UseGuards(SupabaseAuthGuard)
@Controller('comments')
export class PostCommentController {
  constructor(
    private commentsService: PostCommentService,
    private postService: PostService,
  ) {}

  @Get('/')
  @ApiQuery({
    name: 'postId',
    description: 'The id of the post to get comments from.',
  })
  @ApiOkArrayResponseCommon(PostCommentDto)
  async getAllCommentsFromPost(
    @Query('postId') postId: string,
    @Query('pagination') pagination: PaginationQueryDto,
  ) {
    try {
      const [comments, meta] = await this.commentsService.getAllPaginated({
        where: {
          postId: postId,
          parentId: null,
        },

        limit: pagination.limit,
        page: pagination.page,
      });

      return ApiPaginatedResponseDto.success(
        comments.map((comment) => PostCommentDto.fromPostComment(comment)),
        {
          currentPage: meta.currentPage,
          lastPage: meta.pageCount,
          next: meta.nextPage,
          perPage: pagination.limit,
          prev: meta.previousPage,
          total: meta.totalCount,
        },
      );
    } catch (error) {
      return ApiPaginatedResponseDto.error(error);
    }
  }

  @Post('/')
  @ApiCreatedResponseCommon(PostCommentDto)
  async createComment(
    @Request() req: RequestWithUser,
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
            id: createOneDto.postId,
          },
        },
        parent: !createOneDto.parentId
          ? undefined
          : {
              connect: {
                id: createOneDto.parentId,
              },
            },
      });

      await this.postService.incrementCommentCount({
        postId: createOneDto.postId,
        amount: 1,
      });

      return ApiResponseDto.success(PostCommentDto.fromPostComment(comment));
    } catch (error) {
      return ApiResponseDto.error(error);
    }
  }

  @Delete('/:commentId')
  @ApiParam({
    name: 'commentId',
    description: 'The id of the comment to be deleted.',
  })
  @ApiOkResponseCommon(PostCommentDto)
  async deleteComment(
    @Request() req: RequestWithUser,
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
        postId: deletedComment.postId,
        amount: 1,
      });

      return ApiResponseDto.success(
        PostCommentDto.fromPostComment(deletedComment),
      );
    } catch (error) {
      return ApiResponseDto.error(String(error));
    }
  }

  @Patch('/:commentId')
  @ApiParam({
    name: 'commentId',
    description: 'The id of the comment to be updated.',
  })
  @ApiOkResponseCommon(PostCommentDto)
  async updateComment(
    @Request() req: RequestWithUser,
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

  @Get('/:commentId')
  @ApiParam({
    name: 'commentId',
    description: 'The id of the parent comment to get the children comments.',
  })
  @ApiOkArrayResponseCommon(PostCommentDto)
  async getChildComments(@Param('commentId') commentId: string) {
    try {
      const comments = await this.commentsService.getAll({
        where: {
          parentId: commentId,
        },
      });

      return ApiResponseDto.success(
        comments.map((comment) => PostCommentDto.fromPostComment(comment)),
      );
    } catch (error) {
      return ApiResponseDto.error(String(error));
    }
  }

  @Post('/:commentId/like')
  @ApiParam({
    name: 'commentId',
    description: 'The id of the comment to be liked.',
  })
  @ApiOkResponseCommon(String)
  async likeComment(
    @Request() req: RequestWithUser,
    @Param('commentId') commentId: string,
  ) {
    try {
      const comment = await this.commentsService.getOne({
        id: commentId,
      });

      if (!comment) {
        throw new Error('Comment not found');
      }

      const hasLiked = await this.commentsService.hasLikedComment({
        commentId: comment.id,
        userId: req.user.id,
      });

      if (hasLiked) {
        throw new Error('You have already liked this comment');
      }

      await this.commentsService.likeComment({
        commentId: comment.id,
        userId: req.user.id,
      });

      return ApiResponseDto.success('Comment liked');
    } catch (error) {
      return ApiResponseDto.error(String(error));
    }
  }

  @Delete('/:commentId/like')
  @ApiParam({
    name: 'commentId',
    description: 'The id of the comment to be unliked.',
  })
  @ApiOkResponseCommon(String)
  async unlikeComment(
    @Request() req: RequestWithUser,
    @Param('commentId') commentId: string,
  ) {
    try {
      const comment = await this.commentsService.getOne({
        id: commentId,
      });

      if (!comment) {
        throw new Error('Comment not found');
      }

      await this.commentsService.unlikeComment({
        commentId: comment.id,
        userId: req.user.id,
      });

      return ApiResponseDto.success('Comment unliked');
    } catch (error) {
      return ApiResponseDto.error(String(error));
    }
  }
}
