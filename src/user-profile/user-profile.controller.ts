import {
  Body,
  Controller,
  Patch,
  Post,
  Request,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { SupabaseAuthGuard } from 'src/auth/guards/supabase-auth.guard';
import { ApiOkResponseCommon } from 'src/common/decorators/api-ok-response-decorator';
import { RequestWithUser } from 'src/common/interfaces/request-with-user.interface';
import { UserProfileUpdateDto } from './dto/user-profile-update.dto';
import { ApiResponseDto } from 'src/common/dtos/api-response-dto';
import { UserService } from 'src/user/user.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { UserProfileService } from './user-profile.service';

@ApiTags('User Profile')
@Controller('user-profile')
export class UserProfileController {
  constructor(
    private userService: UserService,
    private userProfileService: UserProfileService,
  ) {}

  @Post('/upload-avatar')
  @ApiBearerAuth()
  @UseGuards(SupabaseAuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @ApiOkResponseCommon(String)
  async uploadAvatar(
    @Request() req: RequestWithUser,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<ApiResponseDto<string>> {
    try {
      await this.userProfileService.updateUserProfileImage(req.user.id, file);

      return ApiResponseDto.success('Avatar uploaded.');
    } catch (error) {
      return ApiResponseDto.error(error.message);
    }
  }

  @Patch('/')
  @ApiBearerAuth()
  @UseGuards(SupabaseAuthGuard)
  @ApiOkResponseCommon(String)
  async updateMe(
    @Request() req: RequestWithUser,
    @Body() body: UserProfileUpdateDto,
  ): Promise<ApiResponseDto<string>> {
    const profile = await this.userService.updateOne({
      where: {
        id: req.user.id,
      },
      input: {
        firstName: body.firstName,
        lastName: body.lastName,
        middleName: body.middleName,
        avatarUrl: body.avatarUrl,
      },
    });

    if (!profile) {
      return ApiResponseDto.error('User not found.');
    }

    return ApiResponseDto.success("User's profile updated.");
  }
}
