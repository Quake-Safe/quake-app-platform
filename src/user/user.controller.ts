import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UserDto } from './dto/user-dto';
import { UserCreateDto } from './dto/user-create-dto';
import { ApiResponseDto } from 'src/common/dtos/api-response-dto';
import { ApiCreatedResponseCommon } from 'src/common/decorators/api-created-response-decorator';
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

  @Get()
  @ApiOkArrayResponseCommon(UserDto)
  async getAll(): Promise<ApiResponseDto<UserDto[]>> {
    return ApiResponseDto.success([]);
  }

  @Get('/me')
  @ApiBearerAuth()
  @UseGuards(SupabaseAuthGuard)
  @ApiOkResponseCommon(UserMeDto)
  async me(
    @Request() req: RequestWithUser,
  ): Promise<ApiResponseDto<UserMeDto | null>> {
    console.log('User: ', req.user);

    return ApiResponseDto.success(null);
  }
  @Post()
  @ApiCreatedResponseCommon(UserDto)
  async create(
    @Body() userCreateDto: UserCreateDto,
  ): Promise<ApiResponseDto<any>> {
    try {
      const userExists = await this.userService.user({
        OR: [
          {
            username: userCreateDto.username,
          },
          {
            email: userCreateDto.email,
          },
        ],
      });

      if (userExists) {
        throw new Error('User with this username or email already exists.');
      }

      return ApiResponseDto.success({});
    } catch (error) {
      return ApiResponseDto.error(String(error));
    }
  }
}
