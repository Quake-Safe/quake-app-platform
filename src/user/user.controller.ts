import { Body, Controller, Get, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { UserDto } from './dto/user-dto';
import { UserCreateDto } from './dto/user-create-dto';
import { ApiResponseDto } from 'src/common/dtos/api-response-dto';
import { ApiCreatedResponseCommon } from 'src/common/decorators/api-created-response-decorator';
import { ApiOkArrayResponseCommon } from 'src/common/decorators/api-ok-array-response-decorator';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Get()
  @ApiOkArrayResponseCommon(UserDto)
  async getAll(): Promise<ApiResponseDto<UserDto[]>> {
    return ApiResponseDto.success([]);
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
