import { Body, Controller, Get, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { UserDto } from './dto/user-dto';
import { UserCreateDto } from './dto/user-create-dto';
import { ApiResponseDto } from 'src/common/dtos/api-response-dto';
import * as bcrypt from 'bcrypt';
import { ApiCreatedResponseCommon } from 'src/common/decorators/api-created-response-decorator';
import { ApiOkArrayResponseCommon } from 'src/common/decorators/api-ok-array-response-decorator';
import { Prisma } from '@prisma/client';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Get()
  @ApiOkArrayResponseCommon(UserDto)
  async getAll(): Promise<ApiResponseDto<UserDto[]>> {
    const users = await this.userService.users({});
    return ApiResponseDto.success(users);
  }

  @Post()
  @ApiCreatedResponseCommon(UserDto)
  async create(
    @Body() userCreateDto: UserCreateDto,
  ): Promise<ApiResponseDto<UserDto>> {
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

      const hashedPassword = bcrypt.hashSync(userCreateDto.password, 10);

      const user = await this.userService.createOne({
        email: userCreateDto.email,
        name: userCreateDto.name,
        username: userCreateDto.username,
        hashedPassword,
      });

      return ApiResponseDto.success(user);
    } catch (error) {
      return ApiResponseDto.error(String(error));
    }
  }
}
