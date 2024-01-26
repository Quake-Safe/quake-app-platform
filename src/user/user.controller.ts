import { Controller, Get, Request, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { ApiResponseDto } from 'src/common/dtos/api-response-dto';
import { ApiOkArrayResponseCommon } from 'src/common/decorators/api-ok-array-response-decorator';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ApiOkResponseCommon } from 'src/common/decorators/api-ok-response-decorator';
import { UserMeDto } from './dto/user-me.dto';
import { SupabaseAuthGuard } from 'src/auth/guards/supabase-auth.guard';
import { RequestWithUser } from 'src/common/interfaces/request-with-user.interface';

@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Get('/me')
  @ApiBearerAuth()
  @UseGuards(SupabaseAuthGuard)
  @ApiOkResponseCommon(UserMeDto)
  async me(
    @Request() req: RequestWithUser,
  ): Promise<ApiResponseDto<UserMeDto | null>> {
    return ApiResponseDto.success({
      username: req.user.user_metadata.username as string,
      id: req.user.id,
      email: req.user.email ?? '',
    });
  }
}
